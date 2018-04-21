import React from 'react';
import { 
  AppRegistry, Button, View, Text, TextInput, TouchableHighlight, TouchableOpacity, StyleSheet, FlatList, Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import API from './api.js';

var NUM_MOVIES = 5; // number of movies to display on the list screen

class ListScreen extends React.Component {

  constructor() {
    super();
    this.loadMovie = this.loadMovie.bind(this);
    this.gosearch = this.gosearch.bind(this);
    this.state = {
      listData : Array(5).fill(null),
      search : ''
    };
  }

  loadMovie(title){
    API(title).then((data) => {
      let movies = data.results // array of movies
      movies = movies.slice(0,NUM_MOVIES); // Take only the first NUM_MOVIES movies
      const listData = this.state.listData.slice()
      for (let i = 0; i < NUM_MOVIES; i++)
        listData[i] = movies[i];
      this.setState({
        listData : listData
      });
    });
  }

  gosearch(){
    this.loadMovie(this.state.search);
  }

  static navigationOptions = {
    title: 'Movie Explorer',
  };
  render() {
    let pic = {uri: 'https://image.tmdb.org/t/p/w200/jIjdFXKUNtdf1bwqMrhearpyjMj.jpg'};
    const listData  = this.state.listData.slice();
    // show this at when the app first loads
    let dataToShow = [
      {key: 'Movie 1', imgSource: require('./image_not_found.png')},
      {key: 'Movie 2', imgSource: require('./image_not_found.png')},
      {key: 'Movie 3', imgSource: require('./image_not_found.png')},
      {key: 'Movie 4', imgSource: require('./image_not_found.png')},
      {key: 'Movie 5', imgSource: require('./image_not_found.png')}
    ];
    // api call successful, listData is not null array
    if (listData[0] !== null){
      dataToShow = [];
      for (let k = 0; k < NUM_MOVIES; k++){
        let imgURI = 'https://image.tmdb.org/t/p/w200/';
        imgURI += listData[k].poster_path;
        new_obj = {
          key: listData[k].title, 
          imgSource: {uri: imgURI},
          vote_average: listData[k].vote_average,
          overview: listData[k].overview,
          release_date: listData[k].release_date
        };
        dataToShow.push(new_obj);
      }
    }
    return (
      <View style={{padding: 20}}>
        <TextInput style={styles.input} 
          value={this.state.search}
          onChangeText={(search) => this.setState({search})}
        />
        <TouchableOpacity style={styles.button}
          onPress={this.gosearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <Text style={{fontSize:30}}>
          List Screen
        </Text>
        <FlatList
          data = {dataToShow}
          renderItem = { ({item}) => {
              return(
                <TouchableHighlight onPress={() => {
                  this.props.navigation.navigate('Details', {
                    movieName: item.key,
                    poster: item.imgSource,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    release_date: item.release_date
                  });
                }}>
                  <View style={styles.row}>
                    <Image style={styles.image} source={item.imgSource}/>
                    <Text style={styles.title}>
                      {item.key}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            }
          }
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {

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

    /*console.log(poster);
    console.log(vote_average);
    console.log(overview);
    console.log(release_date);*/

    return (
      <View style={{padding: 20, flexDirection: 'row'}}>
        <View style={{flex: 2}}>
          <Image style={styles.image} source={poster}/>
          <Text> Rating: {vote_average} </Text>
        </View>
        <View style={{flex:3, padding:10}}>
          <Text style={{fontSize: 20}}> {movieName} </Text>
          <View style={{height:1, backgroundColor:'lightgray', margin:5}}/>
          <Text> Released on: {release_date} </Text>
          <View style={{height:1, backgroundColor:'lightgray', margin:5}}/>
          <Text> Plot: {overview} </Text>
        </View>
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: ListScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'darkred',
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
    padding: 20
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
    fontSize: 20,
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