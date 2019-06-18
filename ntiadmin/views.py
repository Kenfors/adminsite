from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, RequestContext
from django.forms import formset_factory
from ntiadmin import metadata
from ntiadmin.models import Student, Course, CourseEnroll, EWSSubmission
from ntiadmin.forms import EWSSubmissionForm, EWSSubmissionForm2, EWSChoiceForm
import json
# Create your views here.

def tools(request):


    HttpResponse(render(request, "Hello Tools!"))


def ews(request):
    templ = loader.get_template('ntiadmin/ews/ews_table.html')

    #https://simpleisbetterthancomplex.com/article/2017/08/19/how-to-render-django-form-manually.html


    pagecontext = {}

    filterForm = EWSChoiceForm()
    if(request.method == 'GET'):
        pagecontext['filter'] = filterForm

    elif(request.method == 'POST'):
        print("POST -> Redirect with options")
        filterForm = EWSChoiceForm(request.POST)
        pagecontext['filter'] = filterForm

        print("teacher: ", filterForm.data['ewsoption_teacher'])
        print("class: ", filterForm.data['ewsoption_class'])
        print("course: ", filterForm.data['ewsoption_course'])

        teacher_filter = filterForm.data['ewsoption_teacher']
        class_filter = filterForm.data['ewsoption_class']
        course_filter = filterForm.data['ewsoption_course']

        print("Teacher:", 'NO TEACHERS YET')
        print("Class:", metadata.CLASSES[int(class_filter)])
        print("Course:", metadata.COURSES[int(course_filter)])

        kwfilters = {}
        #if(int(teacher_filter) != 0):
        #    kwfilters['student__class_name'] = int(teacher_filter)

        if(int(class_filter) != 0):
            kwfilters['student__class_name'] = int(class_filter)
        
        if(int(course_filter) != 0):
            kwfilters['course__course_name'] = int(course_filter)

        enrolls = CourseEnroll.objects.all().filter(**kwfilters).order_by('student')
        print(enrolls)


        # FILTER FOR CURRENT EWS ENTRIES
        # - Current Month 
        # - 

        submissionforms = []
        for currentenroll in enrolls:
            print("Enroll ID: ", currentenroll.id)
            print("Student ID: ", currentenroll.student.id)
            print("Course Code: ", currentenroll.course.course_code)
            formdata = {
                'student' : currentenroll.student.__str__(),
                'course'  : currentenroll.course.course_code,
                'enroll'  : currentenroll.id,
            }
            try:
                submission = EWSSubmission.objects.get(enroll__id=currentenroll.id)

            except EWSSubmission.DoesNotExist:
                submission = EWSSubmission(enroll=currentenroll)
            finally:
                formdata['ewscolor'] = submission.ewscolor
                formdata['ewshelper'] = submission.ewshelper
                ewsform = EWSSubmissionForm(formdata)
                print("Form: \n", ewsform)
                submissionforms.append(formdata)
            
        EWSFormSet = formset_factory(EWSSubmissionForm)
        formset = EWSFormSet(initial=submissionforms)
        pagecontext['ewstable'] = formset                    
    else:
        print("ERROR")


    return HttpResponse(templ.render(pagecontext, request))

OPT_COURSE  = 0
OPT_STUDENT = 1
OPT_TEACHER = 2

def ews_report_table(request, opt, value):
    response = loader.get_template('ntiadmin/ews/ews_table.html')

    #IF course:
    #  List enrolls for that course
    #  Put form for every enroll - each row
    if(opt == OPT_COURSE):
        print("Show course: ", value)
    
    #IF student:
    #  List enrolls for that student
    #  Put form for every enroll - each row
    if(opt == OPT_COURSE):
        print("Show course: ", value)

    #LATER if teacher
    # Make list of courses, put table for each course.
    # Put entry for each course, of that teacher
    if(opt == OPT_TEACHER):
        print("Show courses for: ", value)

    table_data = [
        ('name', 'class', 'course', 'ewscolor', 'ewshelper')

    ]

    myForm = EWSSubmissionForm2()

    return HttpResponse(response.render({'form' : myForm.as_table()}))



def studieomdome(request):
    response = loader.get_template('ntiadmin/admindoc/studieomdome_mall.html')

    return HttpResponse(response.render({}, request))