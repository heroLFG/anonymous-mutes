from django.db import models


class Profile(models.Model):
    id = models.CharField(primary_key=True, max_length=256)
    created_at = models.DateTimeField()


class Message(models.Model):
    key = models.CharField(max_length=256)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
