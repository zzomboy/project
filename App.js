import React from 'react';
import { 
	AppRegistry, Button, View, Text, TextInput, TouchableHighlight, TouchableOpacity, StyleSheet, FlatList, Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import topstoriesapi from './topstoriesapi.js';

class TopStories extends React.Component {

	constructor() {
		super();
		this.loadtopstories = this.loadtopstories.bind(this);
		//this.gosearch = this.gosearch.bind(this);
		this.state = {
			listData : Array(10).fill(""),
			num_show : 10, 
			num_results : 0
		};
		this.loadtopstories("home");
	}

	loadtopstories(title){
		topstoriesapi(title).then((data) => {
			let topstories = data.results 
			topstories = topstories.slice(0,this.state.num_show);
			const listData = this.state.listData.slice()
			for (let i = 0; i < this.state.num_show; i++)
				listData[i] = topstories[i];
			this.setState({
				listData : listData,
				num_results : data.num_results
			});
		});
	}

	/*gosearch(){
		this.loadMovie(this.state.search);
	}*/

	static navigationOptions = {
		title: 'Top Stories',
	};
	render() {
		const listData  = this.state.listData;
		let dataToShow = [
			{title: 'Story 1', multimedia: require('./image_not_found.png')},
			{title: 'Story 2', multimedia: require('./image_not_found.png')},
			{title: 'Story 3', multimedia: require('./image_not_found.png')},
			{title: 'Story 4', multimedia: require('./image_not_found.png')},
			{title: 'Story 5', multimedia: require('./image_not_found.png')},
			{title: 'Story 6', multimedia: require('./image_not_found.png')},
			{title: 'Story 7', multimedia: require('./image_not_found.png')},
			{title: 'Story 8', multimedia: require('./image_not_found.png')},
			{title: 'Story 9', multimedia: require('./image_not_found.png')},
			{title: 'Story 10', multimedia: require('./image_not_found.png')},
		];

		if (listData[0] !== null){
			dataToShow = [];
			for (let k = 0; k < this.state.num_show; k++){
				let tmp = listData[k].multimedia;
				if (tmp === undefined){
					url = require('./image_not_found.png');
				}else{
					url = { uri : tmp[4].url};
				}
				console.log(url);
				new_obj = {
					title: listData[k].title,
					multimedia:  url,
					abstract : listData[k].abstract
				};
				dataToShow.push(new_obj);
			}
		}

		return (
			<View style={styles.container}>
				{/*}<TextInput 
					style={styles.input} 
					value={this.state.search}
					onChangeText={(search) => this.setState({search})}
				/>
				<TouchableOpacity 
					style={styles.button}
					onPress={this.gosearch} >
					<Text style={styles.buttonText}>Search</Text>
				</TouchableOpacity>*/}
				<Text style={{fontSize:30,marginBottom:8}}>
					Top Stories
				</Text>
				<FlatList
					data = {dataToShow}
					renderItem = { ({item}) => {
						return(
							<TouchableHighlight 
								onPress={() => {
									this.props.navigation.navigate('Details', {
										title: item.title,
										abstract : item.abstract
									});
								}}
							>
								<View style={styles.row}>
									<Image style={styles.image} source={item.multimedia}/>
									<Text style={styles.title}>
										{item.title}
									</Text>
								</View>
							</TouchableHighlight>
						);
					}}
				/>
			</View>
		);
	}
}

/*class DetailsScreen extends React.Component {

	static navigationOptions = {
		title: 'Movie Details',
	};

	render() {
		const { params } = this.props.navigation.state;
		const movieName = params ? params.movieName : null;
		const poster = params ? params.poster : null;
		const vote_average = params ? params.vote_average : null;
		const overview = params ? params.overview : null;
		const release_date = params ? params.release_date : null;

		return (
			<View style={{padding: 20, flexDirection: 'row'}}>
				<View style={{flex: 2}}>
					<Image style={styles.image} source={poster}/>
					<Text> Rating: {vote_average} </Text>
				</View>
				<View style={{flex:3, padding:10}}>
					<Text style={{fontSize: 20}}>
						{movieName}
					</Text>
					<View style={{height:1, backgroundColor:'lightgray', margin:5}}/>
					<Text> 
						Released on: {release_date} 
					</Text>
					<View style={{height:1, backgroundColor:'lightgray', margin:5}}/>
					<Text>
						Plot: {overview}
					</Text>
				</View>
			</View>
		);
	}
}*/

const RootStack = StackNavigator(
	{
		Home: {
			screen: TopStories,
		},
		/*Details: {
			screen: DetailsScreen,
		},*/
	},
	{
		initialRouteName: 'Home',
		navigationOptions: {
			headerStyle: {
				backgroundColor: 'darkgrey',
			},
			headerTintColor: '#fff',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
		},
	}
);

export default class App extends React.Component {
	render() {
		return <RootStack />;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'column',
		paddingRight: 20,
		paddingLeft: 20,
		paddingTop: 10,
		paddingBottom: 10
	},
	row : {
		flexDirection: 'row',
		height: 100,
		flex: 1
	},
	image: {
		height: 100,
		flex: 2
	},
	title: {
		fontSize: 16,
		flex: 5,
		padding: 20,
		borderWidth: 1
	},
	input: {
		padding: 10,
		height: 40,
		borderWidth: 1
	},
	buttonText: {
		fontSize: 25
	},
});