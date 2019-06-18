from django.contrib import admin
from ntiadmin.models import Student, Course, CourseEnroll, EWSSubmission 

# Register your models here.

admin.site.register(Student)
admin.site.register(Course)
admin.site.register(CourseEnroll)
admin.site.register(EWSSubmission)

