import React from 'react';
import './ProfileCard.css';

const ProfileCard = props => (

    <div class = "modal">

        <div className = "bgImage">
        <img src={'/api/images/' + props.image} alt={props.name}></img>
        <div class = "upperBox">
            <div class = "cardTitle">{props.name}</div>
            <input class = "btnC" type = "submit" value = "Comments"/> 
        </div>
        <div class = "infoBox"> 
            <div class = "textBox">
                {props.description}
            </div>
        </div>
        </div>
    </div>

);

export default ProfileCard;