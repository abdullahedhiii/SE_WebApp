from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    #is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class SubUser(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subusers')
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    relationship = models.CharField(max_length=50, blank=True) 
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"

class Category(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, blank=True)  # Optional

    def __str__(self):
        return f"{self.name} ({self.owner.username})"

class Expense(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    subuser = models.ForeignKey(SubUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} - {self.owner.username} - {self.category}"