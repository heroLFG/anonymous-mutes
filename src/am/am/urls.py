from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers
from discord import views

router = routers.DefaultRouter()
router.register(r'publish', views.PublishViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/messages/', views.MessageViewSet.as_view(), name="messages"),
    path('admin/', admin.site.urls),
    re_path('^.*', include('frontend.urls')),
]
