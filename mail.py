# -*- coding: utf-8 -*-
"""
Created on Tue Jan 10 17:23:18 2023

@author: svmah
"""

import smtplib
from email.message import EmailMessage

SENDER_EMAIL = "puru.devkar@gmail.com"
APP_PASSWORD = "xjpbqxdhiywmtuqp"


print("Mail Start")
msg = EmailMessage()
msg['Subject'] = "Suspicious Activity Detection"
msg['From'] = SENDER_EMAIL
msg['To'] = "aniketkalbhor7700@gmail.com"
msg.set_content('Suspicious Activity Detected')

   



with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(SENDER_EMAIL, APP_PASSWORD)
        smtp.send_message(msg)
        print("Mail send successfully")
