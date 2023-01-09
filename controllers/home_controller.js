const Post = require('../models/post');
const User = require('../models/user');

const Like = require('../models/like');




module.exports.home = async function(req, res){

    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
         
        
        .populate('likes')

        .populate({
            path:'comments',
            options:{
               sort:{
                   'createdAt':-1
               }
            }
           })
        
        .deepPopulate('comments.user comments.likes')
        
  

        let users = await User.find({});
        
        let frndList , sendList , receiveList;

        if(req.user){
            let currentUser = await User.findById(req.user._id);
            //console.log(currentUser);
            let myfrndList = currentUser.friendList;//take all the friend of current user

            frndList = myfrndList.filter((ele) => {
                return ele.status == "Friends"
            });
             // console.log(frndList);
            frndList = frndList.map (a => a.userid.toString());

            sendList = myfrndList.filter((ele) => {
               return ele.status == "Send"
           });
          
           sendList = sendList.map (a => a.userid.toString());
              console.log( "sendlist" ,sendList);

           receiveList = myfrndList.filter((ele) => {
             return ele.status == "Receive"
       });
         
       receiveList = receiveList.map (a => a.userid.toString());
        }
       // console.log("receiveList" ,receiveList);
    // console.log(sendList);
       
      
     // poupulating post's reaction, with it's reactions array to display in ejs
     posts.forEach(ele =>{
        
        let sad = ele.likes.filter((a) => {
            return a.reaction == "Sad"
         });
        sad = sad.map(a=> a.user);

        let wow = ele.likes.filter((a) => {
            return a.reaction == "Wow"
         });
        wow = wow.map(a=> a.user);

        let love = ele.likes.filter((a) => {
            return a.reaction == "Love"
         });
        love = love.map(a=> a.user);

        let angry = ele.likes.filter((a) => {
            return a.reaction == "Angry"
         });
        angry = angry.map(a=> a.user);

        let like = ele.likes.filter((a) => {
            return a.reaction == "Like"
         });
        like = like.map(a=> a.user);

       
        ele.emojiData =  {
            post_id : ele._id,
            sad : sad,
            wow: wow,
            love:love,
            like : like,
            angry : angry
            
        }
           ele.save();
    });

   //  poupulating comment's reaction, with it's reactions array to display in ejs

     posts.forEach(postEle =>{
        
        // console.log(postEle);
        postEle.comments.forEach(ele => {

            let csad = ele.likes.filter((a) => {
                return a.reaction == "Sad"
             });
            csad = csad.map(a=> a.user);
    
            let cwow = ele.likes.filter((a) => {
                return a.reaction == "Wow"
             });
            cwow = cwow.map(a=> a.user);
    
            let clove = ele.likes.filter((a) => {
                return a.reaction == "Love"
             });
            clove = clove.map(a=> a.user);
    
            let cangry = ele.likes.filter((a) => {
                return a.reaction == "Angry"
             });
            cangry = cangry.map(a=> a.user);
    
            let clike = ele.likes.filter((a) => {
                return a.reaction == "Like"
             });
            clike = clike.map(a=> a.user);
    
    
               ele.commentEmojiData =  {
                post_id : ele._id,
                sad : csad,
                wow: cwow,
                love:clove,
                like : clike,
                angry : cangry
                
            }
               ele.save();
             //  console.log("print ele",ele);
               //console.log("print ele",ele.commentEmojiData);
               
        });
       //  postEle.save();
        
     });
    
    //console.log(req.user);

     if(req.user.usertype == "Organization"){
         return res.render('organization_page',{
             title: "Codeial |organization",
             posts :posts,
             all_users :users
         });
     }
    
    else if(req.user.usertype == "Personal"){
        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users: users,
            frndList :frndList,
            sendList :sendList,
            receiveList : receiveList
        });
   }else{
       return res.render('user_sign_in',{
           title:"sign In"
       })
   }
    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

module.exports.organization = async function(req,res){
    

    try{
        // populate the user of each post
       let posts = await Post.find({})
       .sort('-createdAt')
       .populate('user')
        
       
       .populate('likes')

       .populate({
           path:'comments',
           options:{
              sort:{
                  'createdAt':-1
              }
           }
          })
       
       .deepPopulate('comments.user comments.likes')

       
      
     
    // poupulating post's reaction, with it's reactions array to display in ejs
    posts.forEach(ele =>{
       
       let sad = ele.likes.filter((a) => {
           return a.reaction == "Sad"
        });
       sad = sad.map(a=> a.user);

       let wow = ele.likes.filter((a) => {
           return a.reaction == "Wow"
        });
       wow = wow.map(a=> a.user);

       let love = ele.likes.filter((a) => {
           return a.reaction == "Love"
        });
       love = love.map(a=> a.user);

       let angry = ele.likes.filter((a) => {
           return a.reaction == "Angry"
        });
       angry = angry.map(a=> a.user);

       let like = ele.likes.filter((a) => {
           return a.reaction == "Like"
        });
       like = like.map(a=> a.user);

      
       ele.emojiData =  {
           post_id : ele._id,
           sad : sad,
           wow: wow,
           love:love,
           like : like,
           angry : angry
           
       }
          ele.save();
   });

  //  poupulating comment's reaction, with it's reactions array to display in ejs

    posts.forEach(postEle =>{
       
       // console.log(postEle);
       postEle.comments.forEach(ele => {

           let csad = ele.likes.filter((a) => {
               return a.reaction == "Sad"
            });
           csad = csad.map(a=> a.user);
   
           let cwow = ele.likes.filter((a) => {
               return a.reaction == "Wow"
            });
           cwow = cwow.map(a=> a.user);
   
           let clove = ele.likes.filter((a) => {
               return a.reaction == "Love"
            });
           clove = clove.map(a=> a.user);
   
           let cangry = ele.likes.filter((a) => {
               return a.reaction == "Angry"
            });
           cangry = cangry.map(a=> a.user);
   
           let clike = ele.likes.filter((a) => {
               return a.reaction == "Like"
            });
           clike = clike.map(a=> a.user);
   
   
              ele.commentEmojiData =  {
               post_id : ele._id,
               sad : csad,
               wow: cwow,
               love:clove,
               like : clike,
               angry : cangry
               
           }
              ele.save();
            //  console.log("print ele",ele);
              //console.log("print ele",ele.commentEmojiData);
              
       });
      //  postEle.save();
       
    });
   
    
        return res.render('organization_page',{
            title: "Codeial |organization",
            posts :posts
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
   
       
};


