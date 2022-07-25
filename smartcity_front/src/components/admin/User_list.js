import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../footer';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import $ from 'jquery';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';



class User_list extends Component{
    constructor(props){
        super(props);
        this.state={
            sysList:[
                
                    
            ],
            checking:[]
        }
    }
    getAppInfo= ()=>{
        let token = cookie.load('chaut');
        $.ajax({
            url : '/security/users',
            type : 'GET',
            beforeSend : (xhr)=>{
                xhr.setRequestHeader("Authorization",'Basic '+ token);
            },
            
            success : (res)=>{
                
                this.setState({
                    sysList : res
                })
                
            },
            error : (res)=>{
                alert('오류가 발생했습니다 잠시 후 시도해주세요.');
            }
        })

    }
    componentWillMount(){
        window.jQuery = $;
        if(!cookie.load('chaut')){
            console.log('refresh_token');
            $.ajax({
                type:'POST',
                url:'/oauth2.0/token',
                data:{
                    grant_type:"refresh_token",
                    refresh_token:cookie.load('refresh')
                },
                headers:{
                    Authorization:'Basic '+'M2VSb2Zocmw2d1BXYXVYMnUwR1Q6eUZ1OXN2amVKdkNZM1BMa2twRllGMUN2V283TWNMN0Y='
                },
                async:false,
                success:function(result){
                    cookie.save('chaut',result.access_token,{maxAge:3000});
                }
            })
        }
        this.getAppInfo();
    }
    DeleteUser(e){
        var token=cookie.load('chaut');
        var flag=true;
        console.log(this.state.checking.length)
        for(var i=0; i<this.state.checking.length;i++){
            $.ajax({
                type:'DELETE',
                beforeSend : (xhr)=>{
                    xhr.setRequestHeader("Authorization",'Basic '+ token);
                },
                url:'/security/users/'+this.state.sysList[this.state.checking[i]].userid,
                async:false,
                success:function(result){
                    
                },
                error : function(err){
                    flag = false;
                }
            })
            if(!flag)
                break;
        }
        if(flag)
            alert('Success');
        else
            alert('Fail'); 

    }
    Checkbox(e){
        const options = this.state.checking
        let index

        if(e.target.checked){
            options.push(+e.target.id)

        }
        else{
            index = options.indexOf(+e.target.id)
            options.splice(index,1)
        }
        this.setState({checking:options})
    }
    render(){
        
        var list =this.state.sysList;
       
        console.log(list.email_verify);
        
        
        return( 
            <Fragment>
            <Helmet>
                <title>Smartcity Hub Registration</title>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></link>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
            </Helmet>
            <div className="join__wrap">
                <div className="join__inner">
                    <header className="join__header">
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>사용자 계정 관리</h1>
                    </header>
                    <main className="application__main_table">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th style={{width: '5%'}}>#</th>
                                        <th style={{width: '10%'}}>아이디</th>
                                        <th style={{width: '15%'}}>닉네임</th>
                                        <th style={{width: '15%'}}>이름</th>
                                        <th style={{width: '10%'}}>전화번호</th>
                                        <th style={{width: '15%'}}>이메일 </th>

                                        <th style={{width: '10%'}}>Delete </th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    {Object.keys(list).map((key,i)=>{
                                        return (
                                        <tr key={i}>
                                            <td scope='row'>
                                                {i+1}
                                            </td>
                                            
                                            <td>
                                                {list[key].userid}
                                            </td>
                                            <td>
                                                {list[key].nickname}
                                            </td>
                                            <td>
                                                {list[key].name}
                                            </td>
                                            <td>
                                                {list[key].phone}
                                            </td>
                                            <td>
                                                {list[key].email}
                                            </td>
                                            <td>
                                            <input id={i} type="checkbox" style={{height:'20px',width:'20px'}} name='checkBox' onChange = {this.Checkbox.bind(this)}/>
                                                
                                            </td>
                                        </tr>
                                        
                                        )
                                        
                                    })}
                                    </tbody>
                            </table>
                        </div>
                        <div className="join__bottom" style={{marginTop: '10px'}}>
                            
                            <Link to ='/index'>
                            <button className="button button__primary" type="button" onClick={this.DeleteUser.bind(this)} style={{width: '200px', textAlign: 'center'}} >적용</button>
                            </Link>
                            
                            <Link to='/index'>
                            <button className="button button__primary" type="button" style={{width: '200px', textAlign: 'center', backgroundColor: '#e52b50', cursor: 'pointer'}} >돌아가기</button>
                            </Link>
                        </div>
                        <Footer/>
                    </main>
                </div>
            </div>
            </Fragment>
        )
    }
}

export default User_list;
