# Generated by Django 2.1.5 on 2019-05-28 16:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('course_name', models.CharField(max_length=100)),
                ('course_code', models.CharField(max_length=100, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='CourseEnrolls',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ntiadmin.Course')),
            ],
        ),
        migrations.CreateModel(
            name='EWS_submission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submission_date', models.DateField(auto_now_add=True)),
                ('month', models.IntegerField(choices=[(0, 'INGEN'), (1, 'Januari'), (2, 'Februari'), (3, 'Mars'), (4, 'April'), (5, 'Maj'), (6, 'Juni'), (7, 'Juli'), (8, 'Augusti'), (9, 'September'), (10, 'Oktober'), (11, 'November'), (12, 'December')], default=0)),
                ('ews', models.IntegerField(choices=[(0, 'INGEN'), (1, 'Grön'), (2, 'Gul'), (3, 'Röd'), (4, 'LILA')], default=0)),
                ('enroll', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ntiadmin.CourseEnrolls')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('class_name', models.IntegerField(choices=[(0, 'INGEN'), (1, 'EL16'), (2, 'EL17'), (3, 'EL18'), (4, 'EL19'), (5, 'EL20'), (6, 'TEK16'), (7, 'TEK17'), (8, 'TEK18'), (9, 'TEK19'), (11, 'TEK20'), (12, 'DIG16'), (13, 'DIG17'), (14, 'DIG18'), (15, 'DIG19'), (16, 'DIG20'), (17, 'FYRA')], default=0)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='student',
            unique_together={('first_name', 'last_name', 'class_name')},
        ),
        migrations.AlterOrderWithRespectTo(
            name='student',
            order_with_respect_to='last_name',
        ),
        migrations.AddField(
            model_name='courseenrolls',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ntiadmin.Student'),
        ),
        migrations.AlterUniqueTogether(
            name='courseenrolls',
            unique_together={('student', 'course')},
        ),
    ]
