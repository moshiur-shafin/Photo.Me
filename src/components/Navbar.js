import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
const NavBar = () =>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = () =>{
    if(state){
        return [
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/createpost">Create Post </Link></li>,
          <li><Link to="/mysubscribedpost">Subscribed Post </Link></li>,
          <li>
            <button className="btn #c62828 red darken-3 " 
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push('/signin')
                }}
                > 
                   Logout
 
                </button>
          </li>
        ]
    }else{
        return [
          <li><Link to="/signin">Signin </Link></li>,
          <li><Link to="/signup">Signup</Link></li>
        ]
    }
  }
    return (
          <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Photo.me</Link>
      <ul id="nav-mobile" className="right ">

      {renderList()}
        {/* <li><Link to="/signin">Signin </Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/createpost">Create Post </Link></li> */}
       
        {/* if else e add koray now dorkar nai  */}

        
      </ul>
    </div>
  </nav>
    )
}



export default NavBar