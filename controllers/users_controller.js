const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// let's keep it same as before
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){

      try{

        let user =await User.findById(req.params.id);
        User.uploadedAvatar(req,res,function(err){
            if(err){console.log('*****Multer Error',err)}

            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){
               if(user.avatar){
                   fs.unlinkSync(path.join(__dirname, '..', user.avatar));
               }

                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
            
        })

      }catch(err){
          req.flash('error',err);
          return res.redirect('back');
      }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

//send friend request
module.exports.sendFriendRequest =async function(req,res){
       
    // the one who send the request
    let sender = await User.findById(req.user.id);
    //the one whom the request has been send
    let receiver = await User.findById(req.params.id);
    
    let senderObj ={
        userid : req.params.id,
        status :"Send"
    }

    let receiverObj = {
        userid : req.user.id,
        status : "Receive"
    }

    sender.friendList.push(senderObj);
    sender.save();

    receiver.friendList.push(receiverObj);
    receiver.save();

    req.flash('success' ," Friend Request sent successfully !!");
    return res.redirect('back');

} 

//accept friend request
module.exports.acceptFriendRequest =async function(req,res){
  try{
    
    let acceptor = await User.findById(req.user.id);
    let requestor = await User.findById(req.params.id);

//console.log(acceptor);
//console.log(requestor);

    acceptor.friendList.forEach((friend) =>{
        if(friend.userid == req.params.id){
            friend.status = "Friends";
        }
    });
    acceptor.save();
    requestor.friendList.forEach((friend) => {
        if(friend.userid == req.user.id){
            friend.status = "Friends";
        }
    });
    requestor.save();

    req.flash('success',"Friend request Accepted successfully!!")
    return res.redirect('back');
  }
  catch(err){
      req.flash('error',err);
      return res.redirect('back');
  }
    
}

module.exports.removeFriendRequest = async function(req, res){
    try{
   // console.log(`${req.user.id} wants to remove ${req.params.id} as a friend`);

    await User.findByIdAndUpdate(req.user.id, { $pull: {friendList: {userid : req.params.id}}});
    await User.findByIdAndUpdate(req.params.id, { $pull: {friendList: {userid:req.user.id}}});
    req.flash('success', "Friend Request Removed/Cancelled Successfully");
    return res.redirect('back');   
    }
catch(error){
    req.flash('error', error);
    return res.status(500).send(error);
}
}

// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    console.log("logged out");
    req.logout();
    
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}