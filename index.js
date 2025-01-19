let express = require('express')
let app = express()
let body_parser = require('body-parser')
let dbConnect = require('./config')
let jwt = require('jsonwebtoken')
let adminCollection = require('./model/admin')
let staffCollection = require('./model/staff')
let cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(express.static('./public'))
app.use(cookieParser())

// Landing Page
app.get('', (req, res) => {
    try {
        let checkToken = req.cookies.token
        if (checkToken) {
            res.render('homeLandingPage.ejs', { isLogin: checkToken })
        }
        else {
            res.render('homeLandingPage.ejs', { isLogin: checkToken })
        }
    } catch (err) {
        // console.log(err.name);

    }
})

// All Staff Table
app.get('/staff', async (req, res) => {
    // console.log(staffCollection);
    let data = await staffCollection.find()
    console.log(data);
    res.render('allStaff.ejs', { allStaffData: data })
})

// Login Form Render
app.get('/login', async (req, res) => {
    res.render('auth/login.ejs', { alertMessage: '' })
})

// Login Person
app.post('/loginperson', async (req, res) => {
    let loginData = req.body

    try {
        let user = await adminCollection.findOne(
            { email: loginData.email }
        )
        if (!user) {
            user = await staffCollection.findOne(
                { email: loginData.email }
            )
        }

        if (loginData.password == user.password) {
            let token = jwt.sign(
                { id: user._id, role: user.role },
                'Security_key',
                { expiresIn: '1h' }
            )
            res.cookie('token', token, { httpOnly: true })
            res.redirect('/')
        } else {
            res.render('auth/login.ejs',
                { alertMessage: 'Invalide User Or Password' }
            )
        }
    } catch (err) {
        res.render('auth/login.ejs',
            { alertMessage: 'Invalide User Or Password' }
        )
    }
})

// Role Page Render
app.get('/profile', async (req, res) => {
    try {
        let userRole = req.cookies.token
        let decodeToken = jwt.verify(userRole, 'Security_key')
        let findUserData;
        let staff;
        switch (decodeToken.role) {
            case 'Admin':
                findUserData = await adminCollection.findById(
                    { _id: decodeToken.id }
                )
                staff = await staffCollection.find()
                break;

            case 'Chef':
                findUserData = await staffCollection.findById(
                    { _id: decodeToken.id }
                )
                break;
        }
        // console.log(findUserData);
        res.render('profile.ejs', { user: findUserData, staffData: staff, isLogin: userRole })
    } catch (err) {
        res.render('auth/login.ejs', { alertMessage: 'User Not Login' })
    }
})

// Logout User
app.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token')
        res.redirect('/')
    } catch (err) {

    }
})

// Delete Staff From Admin Profile
app.get('/deletestaffrow/:id', async (req, res) => {
    let staffId = req.params.id
    let result = await staffCollection.findByIdAndDelete({ _id: staffId })
    // console.log(result);
    res.redirect('/profile')
})

// send Staff data For Update in Admin Profile
app.get('/sendstaffdata/:id', async (req, res) => {
    let staffId = req.params.id
    let result = await staffCollection.findById({ _id: staffId })
    console.log(result);
    res.render('updateForm.ejs', { updateData: result })
})

// Update staff Data From Admin
app.post('/updateStaff/:id', async (req, res) => {
    let updateData = req.body
    let staffId = req.params.id
    let result = await staffCollection.findByIdAndUpdate(
        { _id: staffId },
        {
            $set: { role: updateData.role }
        }
    )
    console.log(updateData);
    res.redirect('/profile')
})

// Add Staff Form From Admin
app.get('/addstaff', async (req, res) => {
    res.render('addStaff.ejs')
})

// Insert Staff From Admin
app.post('/insertnewstaff', async (req, res) => {
    let newStaffData = req.body
    console.log(newStaffData);
    let result = new staffCollection(
        {
            name: newStaffData.name,
            email: newStaffData.email,
            contact: newStaffData.contact,
            address: newStaffData.address,
            role: newStaffData.role,
            password: `${newStaffData.name.toLowerCase()}@123`
        }
    )
    let data = await result.save()
    console.log(data);

    res.redirect('/profile')
})

// Edit Profile
app.get('/editprofiledata/:role/:userId', async (req, res) => {
    try {
        let { role, userId } = req.params
        console.log(role, userId);
        let user;
        if (role.toLowerCase() == 'admin') {
            user = await adminCollection.findById({ _id: userId })
        } else {
            user = await staffCollection.findById({ _id: userId })
        }
        console.log(user);

        res.render('updateProfile.ejs', { user })
    } catch (err) {
        res.redirect('/profile')
    }
})

// Profile Updated Done
app.post('/profileupdateconfirm/:role/:userId', async (req, res) => {
    try {
        let { role, userId } = req.params
        let { name, email, contact } = req.body
        let user;
        if (role.toLowerCase() == 'admin') {
            user = await adminCollection.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        name: name,
                        email: email,
                        contact: contact
                    }
                }
            )
        } else {
            user = await staffCollection.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        name: name,
                        email: email,
                        contact: contact
                    }
                }
            )
        }
        res.redirect('/profile')
    } catch (err) {
        res.redirect('/profile')
    }
})

// Create Port 
app.listen(5000, () => {
    console.log('Server Start Successfully...');
})