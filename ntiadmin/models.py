from datetime import date
from django.db import models
from ntiadmin import metadata

# Create your models here.




class Student(models.Model):

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    class_name = models.IntegerField(choices=metadata.CLASSES, default=0)
    
    def __str__(self):
        n = str(self.last_name)
        n += str(', ')
        n += str(self.first_name)
        return n

    class Meta:
        order_with_respect_to = 'last_name'
        unique_together = ['first_name', 'last_name', 'class_name']


class Course(models.Model):
    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return str(self.course_name)


class CourseEnroll(models.Model):
    student = models.ForeignKey("ntiadmin.Student", on_delete=models.CASCADE)
    course = models.ForeignKey("ntiadmin.Course", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.student) + " | " + str(self.course)

    class Meta:
        unique_together = ['student', 'course']

class EWSSubmission(models.Model):
    enroll = models.ForeignKey("ntiadmin.CourseEnroll", on_delete=models.CASCADE)
    submission_date = models.DateField(auto_now_add=True)

    month = models.IntegerField(choices=metadata.MONTHS, default=0)
    ewscolor = models.IntegerField(choices=metadata.EWS_VALUES, default=0)
    ewshelper = models.TextField(default=" ")

    def __str__(self):
        return str(self.enroll) + " | " + str(self.ewscolor) + " | " + str(self.ewshelper)
