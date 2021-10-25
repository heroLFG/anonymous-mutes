import logging
import json
import os
import requests

from django.shortcuts import render
from discord.models import Profile, Message
from rest_framework import serializers, viewsets, permissions, generics
from rest_framework.response import Response


logger = logging.getLogger(__name__)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['message', 'timestamp']

class MessageViewSet(generics.ListAPIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.all().order_by('-timestamp')

    def get(self, request, *args, **kwargs):
        qs = self.get_queryset()
        paginated = self.paginate_queryset(qs)
        serializer = MessageSerializer(paginated, many=True)
        return self.get_paginated_response(serializer.data)

class PublishViewSet(viewsets.ViewSet):
    queryset = Message.objects.all()
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        key = request.data.get('key')
        text = request.data.get('text')

        if key == os.getenv('ANONYMOUS_MUTES_SECRET'):
            Message.objects.create(message=text)
            try:
                webhooks = os.getenv('ANONYMOUS_MUTES_WEBHOOKS')
                if webhooks:
                    for webhook in json.loads(webhooks):
                        requests.post(webhook, {"content": text })
            except Exception as e:
                print(e.message)
                logger.log(msg=e.message)

        return Response()
