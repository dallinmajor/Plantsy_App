import React, { Component } from "react";
import PlantCard from '../../components/PlantCard';
import API from '../../utils';
import Jumbotron from '../../components/Jumbotron';
import Nav from '../../components/Nav';
// import Image from '../../components/Image';
import LazyLoad from 'react-lazyload';
// import InputForm from '../../components/InputForm';
// import { FormBtn } from '../../components/Form'
import PicCard from '../../components/PicCard'
import PostPlant from '../../containers/PostAPlant'
import './profile.css';

class Profile extends Component {
    state = {
        user: { plants: 'Plant' },
        tab: 'default',
        display_plants: [],
        addingPlant: false,
        plant: '',
        modal: '',
        plantname: null,
        description: null, 
    }

    async componentDidMount() {
        this.getUser();
    }

    getUser() {
        API.User.findByUsername('dallinmajor')
            .then(user => {
                this.setState({
                    user: user.data,
                    display_plants: user.data.plants
                })
            })
            .catch(err => console.log(err));
    }

    prepPlantForCreation = () => {
        API.Plant.createUserPlant(this.state.user.username, { name: 'Staged' })
            .then(result => (this.setState({
                prepedPlant: result.data._id
            }, console.log(this.state.prepedPlant))))
    }

    handlePostAPlantClick = () => {
        this.setState({
            addingPlant: true
        })
    }

    addPlantToUser = (plant) => {
        console.log(plant)
        this.setState({
            user: this.state.user.plants.shift(plant),
            addingPlant: false
        })
    }

    changePlantHealth = event => {
        API.Plant.update(this.state.plant, {
            health: event.value
        })
    }

    changeDisplayTabs = tab => {
        const { plants } = this.state.user

        this.setState({
            display_plants: plants.filter(plant => plant.health === tab)
        });
    }

    handlePlantClick = (e, plant) => {
        console.log(plant);
        this.setState({
            modal: 'active',
            plant: plant
        })
    }

    closeModal = () => {
        this.setState({
            modal: '',
            plant: ''
        })
    }
    

    addComment = plantId => {
        API.Comments.create(plantId, {
            comment: this.state.comment
        }).then(comment => {

            this.state.user.plants
                .filter(plant => plantId === plant._id).comments
                .push(comment);
        })
    }

    render() {
        const plantAdder = (
            <div>
                <PostPlant
                username={this.state.user.username}
                addPlantToUser={this.addPlantToUser}
                />
            </div>
        )
        return (
            <div>
                {this.state.addingPlant ? plantAdder : null}
                <PlantCard
                    modal={this.state.modal}
                    name={this.state.plant.name}
                    description={this.state.plant.description}
                    health={this.state.plant.health}
                    close={this.closeModal}
                >
                    <PicCard
                        name={this.state.user.username}
                        image={this.state.plant.image}
                    />
                </PlantCard>
                <Jumbotron
                handlePostAPlantClick={this.handlePostAPlantClick}
                >
                    <PicCard
                        name={this.state.user.username}
                        image={this.state.user.profile_picture}
                    />
                </Jumbotron>
                <div className="picBody">
                    <Nav />
                    <div className="picContainer">
                        <div className="picBox">
                            <LazyLoad height={200}>
                                {this.state.display_plants.map(plant => (
                                    <div>
                                        <PicCard
                                            name={plant.name}
                                            image={plant.image}
                                            click={this.handlePlantClick}
                                            plant={[plant]}
                                        />
                                    </div>)
                                )}
                            </LazyLoad>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};

export default Profile;