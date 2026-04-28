const express=require('express');
const router=express.Router();

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const User=require('../models/User');


// REGISTER
router.post('/',async(req,res)=>{

try{

const {username,email,password}=req.body;

if(!username || !email || !password){

return res.status(400).json({
error:'All fields required'
});

}


// check existing
let existingUser=await User.findOne({
$or:[
{email},
{username}
]
});

if(existingUser){

return res.status(409).json({
error:'User already exists'
});

}


// hash password
const salt=await bcrypt.genSalt(10);

const hashedPassword=
await bcrypt.hash(
password,
salt
);


// create user
const user=new User({
username,
email,
password:hashedPassword
});

await user.save();


// token
const payload={
user:{
id:user.id
}
};

const token=jwt.sign(
payload,
process.env.JWT_SECRET,
{
expiresIn:'1h'
}
);

res.status(201).json({
token,
user:{
id:user.id,
username:user.username,
email:user.email
}
});

}
catch(err){

console.error(
'Registration error:',
err
);

res.status(500).json({
error:err.message
});

}

});



// LOGIN
router.post('/login',async(req,res)=>{

try{

const {email,password}=req.body;

const user=
await User.findOne({email});

if(!user){

return res.status(401).json({
error:'Invalid credentials'
});

}

const match=
await bcrypt.compare(
password,
user.password
);

if(!match){

return res.status(401).json({
error:'Invalid credentials'
});

}

const payload={
user:{
id:user.id
}
};

const token=jwt.sign(
payload,
process.env.JWT_SECRET,
{expiresIn:'1h'}
);

res.json({
token,
user:{
id:user.id,
username:user.username,
email:user.email
}
});

}
catch(err){

res.status(500).json({
error:err.message
});

}

});



// CURRENT USER
router.get('/me',async(req,res)=>{

try{

const token=
req.header('x-auth-token');

if(!token){

return res.status(401).json({
error:'No token'
});

}

const decoded=
jwt.verify(
token,
process.env.JWT_SECRET
);

const user=
await User.findById(
decoded.user.id
).select('-password');

res.json(user);

}
catch(err){

res.status(401).json({
error:'Invalid token'
});

}

});

module.exports=router;