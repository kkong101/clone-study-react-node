import {Icon, Col, Card, Row, Carousel } from 'antd';
import React from 'react'

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay>
               {props.images.map((image,index) => {
                   <div key={index}>
                       <img style={{width: '100%', height: '180px'}} src={`http://localhost:5000/${image}`}/>
                   </div>
               } )}
            </Carousel>
        </div>
    )
}

export default ImageSlider