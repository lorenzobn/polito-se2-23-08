import Navbar from './Navbar';
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../core/store/Provider';

function Professor() {
    const store = useContext(StoreContext)

    return(
        <>
            <Navbar></Navbar>
        </>
    ) 
}

export default observer(Professor)