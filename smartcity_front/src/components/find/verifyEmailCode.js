import React, {Component} from 'react';
import queryString from 'query-string';
import InvalidEmailCode from '../error/invalidEmailCode';
import ChangePassword from './changeUserPassword';
import $ from 'jquery';


class verifyEmailCode extends Component{
    constructor(props){
        super(props);
        this.state={
            result : null
        }
    }
    componentDidMount(){
        let email = queryString.parse(window.location.search).email;
        let verifyCode = queryString.parse(window.location.search).verifyCode;
        $.ajax({
            url:"/security/verifyEmailCode",
            type:"POST",
            data : {
                userEmail : email,
                verifyCode : verifyCode
            },
            async: false,
            statusCode : {
                200 : (res)=>{
                    this.setState({
                        result : 200
                    })
                },
                400: ()=>{
                    this.setState({
                        result : 400
                    })
                },
                404: ()=>{
                    this.setState({
                        result : 404
                    })
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
                }
            }
        })
    }
    render(){
        if(this.state.result == 400 || this.state.result == 404 )
            return <InvalidEmailCode/>;
        else if(this.state.result == 200)
            return <ChangePassword/>
        else return null;
    }
}
export default verifyEmailCode;