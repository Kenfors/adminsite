from datetime import date
from django.db import models

# Create your models here.


CLASSES = [
    (0, 'INGEN'),
    (1, 'EL16'),
    (2, 'EL17'),
    (3, 'EL18'),
    (4, 'EL19'),
    (5, 'EL20'),

    (6, 'TEK16'),
    (7, 'TEK17'),
    (8, 'TEK18'),
    (9, 'TEK19'),
    (11, 'TEK20'),

    (12, 'DIG16'),
    (13, 'DIG17'),
    (14, 'DIG18'),
    (15, 'DIG19'),
    (16, 'DIG20'),
    (17, 'FYRA'),
]

MONTHS = [
    (0, 'INGEN'),
    (1, 'Januari'),
    (2, 'Februari'),
    (3, 'Mars'),
    (4, 'April'),
    (5, 'Maj'),
    (6, 'Juni'),
    (7, 'Juli'),
    (8, 'Augusti'),
    (9, 'September'),
    (10, 'Oktober'),
    (11, 'November'),
    (12, 'December'),
]

EWS_VALUES = [
    (0, 'INGEN'),
    (1, 'Grön'),
    (2, 'Gul'),
    (3, 'Röd'),
    (4, 'LILA'),
]

class Student(models.Model):

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    class_name = models.IntegerField(choices=CLASSES, default=0)
    
    def __str__(self):
        return self.first_name + " " + self.last_name
    class Meta:
        order_with_respect_to = 'last_name'
        unique_together = ['first_name', 'last_name', 'class_name']


class Course(models.Model):
    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.course_name


class CourseEnrolls(models.Model):
    student = models.ForeignKey("ntiadmin.Student", on_delete=models.CASCADE)
    course = models.ForeignKey("ntiadmin.Course", on_delete=models.CASCADE)

    def __str__(self):
        return self.student + " " + self.course

    class Meta:
        unique_together = ['student', 'course']

class EWS_submission(models.Model):
    enroll = models.ForeignKey("ntiadmin.CourseEnrolls", on_delete=models.CASCADE)
    submission_date = models.DateField(auto_now_add=True)

    month = models.IntegerField(choices=MONTHS, default=0)
    ews = models.IntegerField(choices=EWS_VALUES, default=0)


    def __str__(self):
        return self.enroll


