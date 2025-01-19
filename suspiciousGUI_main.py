 
import tkinter as tk
from tkinter import ttk, LEFT, END
from PIL import Image, ImageTk
from tkinter.filedialog import askopenfilename
from tkinter import messagebox as ms
import cv2
import sqlite3
import os
import numpy as np
import time
'''import detection_emotion_practice as validate'''

from tkvideo import tkvideo
#import lecture_video  as video

global fn
fn = ""
##############################################+=============================================================
root = tk.Tk()
root.configure(background="brown")
# root.geometry("1300x700")


w, h = root.winfo_screenwidth(), root.winfo_screenheight()
root.geometry("%dx%d+0+0" % (w, h))
root.title("Anomaly Detection ")
video_label =tk.Label(root)
video_label.pack()
#read video to display on label
player = tkvideo("n.mp4", video_label,loop = 1, size = (w, h))
player.play()

label_l1 = tk.Label(root, text="Suspicious Activity Detection ",font=("Times New Roman", 35, 'bold'),
                    background="#000000", fg="Magenta", width=60, height=1)
label_l1.place(x=0, y=0)



def reg():
    from subprocess import call
    call(["python","suspicious_registration.py"])
def log():
    from subprocess import call
    call(["python","suspicious_login.py"])
    
def window():
  root.destroy()


button1 = tk.Button(root, text="LOGIN", command=log, width=14, height=1,font=('times', 20, ' bold '), bg="#FFEBCD", fg="brown")
button1.place(x=20, y=190)

button2 = tk.Button(root, text="REGISTER",command=reg,width=14, height=1,font=('times', 20, ' bold '), bg="#FFEBCD", fg="brown")
button2.place(x=20, y=300)



root.mainloop()