from django import template

register = template.Library()

@register.simple_tag
def tag1(length1):
	return list(range(length1))