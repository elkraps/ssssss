import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Form} from "react-bootstrap";
import DeviceItem from "./DeviceItem";
import './components.css';

const DeviceList = observer(() => {
    const {device} = useContext(Context)

    return (
        
        <Form className='device-list'>
            {device.devices.map(device =>
                <DeviceItem key={device.id} device={device}/>
            )}
        </Form>
        
    );
});

export default DeviceList;
