import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

import {Link} from 'react-router-dom'

const Profile = () => {
    
    // const [mypicture,setPicture] =useState([])
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.mypost)
        })

    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result =>{
           // console.log(result)
           const newData = data.map(item=>{
            if(item._id==result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result =>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }


    const makeComment = (text,postId) =>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                //ekta postId key arekta value 
                text:text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
                
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid) =>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization: "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            M.toast({html:"Deleted Post Succesfully ",classes:"#43a047 red darken-3"})
            setData(newData)
        })
    }

    const deleteComment = (postid) =>{
        fetch(`/deletecomment/${postid}`,{
            method:"delete",
            headers:{
                Authorization: "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            M.toast({html:"Deleted comment Succesfully ",classes:"#43a047 red darken-3"})
            setData(newData)
        })
    }


    return (
        <div style={{maxWidth:"850px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 50px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                <img style={{width:"160px",height:"160px", borderRadius:"80px"}}
                src="https://scontent.fdac24-1.fna.fbcdn.net/v/t1.0-1/c234.514.949.949a/s240x240/104048611_2644670589114476_553145250680054875_o.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_eui2=AeGUjEz8IKIzFwRt_z5qVz6Yu-rzP_rUGlu76vM_-tQaW2dlgjHv795ok9CxHRECV4KsI7Fi27PdqpWuCLoFrww_&_nc_ohc=R6P6__ptHqQAX_kQGlX&_nc_ht=scontent.fdac24-1.fna&oh=7569f99d5b5657ad60ce8a8e90dd8cac&oe=5F12C2F0" 
                />
                </div>

           
            <div>
            {/* <h4> {state?state.name:"loading "}</h4> */}
                
                <h4> {state?state.name:"Please wait a while "}</h4>
                <h5> {state?state.email:"Please wait a while "}</h5>
                
                {/* eitar bhitore arekta div dibo  */}
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h6>{data.length} Posts  </h6>
                {/* <h6>{followers.length:"0"} Followers </h6> */}
                <h6>{state?state.followers.length:"0"} Followers </h6>
                <h6>{state?state.following.length:"0"} Following </h6>

                </div>
                <div>

                </div>

            </div>
        </div>
        <div className="home" > 
        {
            data.map(item=>{
                return(
                    <div  className="card home-card" key={item._id}>
                    {/* <h5> SrabonFreak </h5>  */}

                    <h5 style ={{padding:"10px"}}> <Link to ={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id :  "/profile/"+item.postedBy._id}>  {item.postedBy.name} </Link>
                   {/* uporer like e correction korsi not like mksh */}
                   
                    {/* post delete  */}
                    {item.postedBy._id == state._id
                    && 
                    <i className="material-icons" style={{float:"right",color:"red"
                }}
                onClick={()=>deletePost(item._id)}
                >delete</i>
                    } </h5>
                    <div className= "card-image"> 
                        <img src={item.photo} />
                        </div>
        
                        <div className="card-content">
                        <i className="material-icons" style={{color:"red"}}>favorite</i>
                        {item.likes.includes(state._id)
                        ?
                            <i className="material-icons"
                            onClick={()=>{unlikePost(item._id)}}
                            >thumb_down</i>

                         :   

                         <i className="material-icons"
                         onClick={()=>{likePost(item._id)}}
                         >thumb_up</i>
                        }
                       

                        
                            {/* <h6> Title </h6> */}
                            <h6>{item.likes.length}</h6>
                            <h6>{item.title}</h6>
                            <p> {item.body} </p>
                            {
                                item.comments.map(record=>{
                                    return (
                                        <h6 key={record._id}> <span style={{fontWeight:"500"}}> {record.postedBy.name} </span> {record.text} 
                                        {/* comment delete  */}
                                        {item.postedBy._id == state._id
                                            && 
                                            <i className="material-icons" style={{float:"right",color:"red"
                                        }}
                                        onClick={()=>deleteComment(item._id)}
                                        >delete</i>
                                            }

                                        </h6>
                                    )
                                
                                })
                                
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value,item._id)
                            }}>
                            <input type ="Text" placeholder="Add a comment "/>
                            
                            </form>
                            
        
        
                        </div>
        
                </div>
                 
                )
            })
        }
        

        </div>

       
            {/* <div className="gallery">
                {
                    mypicture.map(item=>{
                        return (
                            <img key ={item._id}className="item" src ={item.photo} alt={item.title}/>
                        )
                    })
                }
         
            </div> */}
       
        </div>
    )
}

export default Profile