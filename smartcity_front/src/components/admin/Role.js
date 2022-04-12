import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../footer';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import $ from 'jquery';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';



class Role extends Component{
    constructor(props){
        super(props);
        this.state={
            roleList:[
                
                    
            ],
            checked:false
        }
    }
    getAppInfo= ()=>{
        let token = cookie.load('chaut');
        $.ajax({
            url : '/accounts/roles',
            type : 'GET',
            beforeSend : (xhr)=>{
                xhr.setRequestHeader("Authorization",'Basic '+ token);
            },
           
            success : (res)=>{
                
                console.log(res.roles.rows);
                this.setState({
                    roleList : res.roles.rows
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
    handleCheckboxChange = event => {
        this.setState({ checked: event.target.checked })
    }
    render(){
        
        var list =this.state.roleList;
       
        
      
        
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
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>권한정보 관리</h1>
                    </header>
                    <main className="application__main_table">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th style={{width: '5%'}}>#</th>
                                        <th style={{width: '15%'}}>권한정보 아이디</th>
                                        <th style={{width: '15%'}}>권한정보 이름</th>
                                        <th style={{width: '15%'}}>권한정보 타입</th>
                                        <th style={{width: '45%'}}>권한정보 설명</th>
                                        <th style={{width: '5%'}}>Delete  </th>
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
                                                {list[key].role_id_pk}
                                            </td>
                                            <td>
                                                {list[key].role_name}
                                            </td>
                                            <td>
                                                {list[key].role_type}
                                            </td>
                                            <td>
                                                {list[key].descriptyion}
                                            </td>
                
                                            <td>
                                            <input id={i} type="checkbox" style={{height:'20px',width:'20px'}} name='checkBox' checked={false} defaultChecked={false}/>
                                                
                                            </td>
                                        </tr>
                                        
                                        )
                                        
                                    })}
                                    </tbody>
                            </table>
                        </div>
                        <div className="join__bottom" style={{marginTop: '10px'}}>
                            <button className="button button__primary" type = "button" style ={{width: '200px',textAlign: 'center',backgroundColor: '#5e4b4e',cursor:'pointer'}}>역활정보 추가</button>
                            <Link to ='/index'>
                            <button className="button button__primary" type="button" style={{width: '200px', textAlign: 'center'}} >적용</button>
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

export default Role;
