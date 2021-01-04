import data from '@/schemas/dataSet/data';
import { connect } from 'dva';
import clone from 'clone';
import {Card, Input, Row, Button, message} from 'antd'
import frSchema from '@/outter/fr-schema/src';
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import service from './service'
const { utils } = frSchema;


class List extends React.Component {
    state={
        oldVaule: '',
        newVaule: '',
        conValue: ''
    }
    onChangeOld =(e)=>{
        console.log(e.target.value)
        this.setState({
            oldValue: e.target.value
        })
    }

    onChangeNew =(e)=>{
        console.log(e.target.value)
        this.setState({
            newValue: e.target.value
        })
    }

    onChangeCon =(e)=>{
        console.log(e.target.value)
        this.setState({
            conValue: e.target.value
        })
    }
    render(){
        return <PageHeaderWrapper
            title={"密码修改"}
            content={null}
        >
            <Card>
                <Row style={{height: '60px', lineHeight: '32px'}}>
                    初始密码:
                    <Input.Password onChange={this.onChangeOld} style={{width: '300px', height: '32px', marginLeft: '10px'}}></Input.Password>
                </Row>
                <Row style={{height: '60px',lineHeight: '32px'}}>
                    新的密码:
                    <Input.Password onChange={this.onChangeNew} style={{width: '300px', height: '32px', marginLeft: '10px'}}></Input.Password>
                </Row>
                <Row style={{height: '60px', lineHeight: '32px'}}>
                    确认密码:
                    <Input.Password  onChange={this.onChangeCon} style={{width: '300px', height: '32px', marginLeft: '10px'}}></Input.Password>
                </Row>
                <Row style={{height: '60px', lineHeight: '32px'}}>
                    <Button onClick={async ()=>{
                        if(this.state.oldValue && this.state.newValue && this.state.conValue && this.state.newValue == this.state.conValue){
                            console.log("chengg")
                            try {
                                await service.editMyPwd({
                                    old_password: this.state.oldValue,
                                    new_password: this.state.newValue
    
                                })
                                message.success("修改成功")

                            } catch (error) {
                                message.error(error.message)
                            }
                            
                        }
                        else{
                            message.error("输入有误，请重新输入！")
                        }
                    }} type="primary" style={{marginLeft: '280px'}}>确认提交</Button>
                </Row>
            </Card>
        </PageHeaderWrapper>
    }
}

export default connect(({ global }) => ({
    dict: global.dict,
}))(List);
