from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^index$', views.index, name='index'),
    url(r'^node$', views.node, name='node'),
    url(r'^ajax$', views.ajax, name='ajax'),
]
