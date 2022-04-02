import React, { Component } from "react";
import "./App.css";
import Nevigation from "./components/Nevigation/Nevigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

import Particles from "react-tsparticles";

//background particles setup
const particlesOptions = {
  // background: {
  //   color: {
  //     value: "#0d47a1",
  //   },
  // },
  fpsLimit: 120,
  // interactivity: {
  //   events: {
  //     onClick: {
  //       enable: true,
  //       mode: "push",
  //     },
  //     onHover: {
  //       enable: true,
  //       mode: "repulse",
  //     },
  //     resize: true,
  //   },
  //   modes: {
  //     bubble: {
  //       distance: 400,
  //       duration: 2,
  //       opacity: 0.8,
  //       size: 40,
  //     },
  //     push: {
  //       quantity: 4,
  //     },
  //     repulse: {
  //       distance: 200,
  //       duration: 0.4,
  //     },
  //   },
  // },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: false,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  //load the info of user in homepage
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  //get the input url info
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      left: clarifaiFace.left_col * width,
      top: clarifaiFace.top_row * height,
      boxWidth: width * (clarifaiFace.right_col - clarifaiFace.left_col),
      boxHeight: height * (clarifaiFace.bottom_row - clarifaiFace.top_row),
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  //click the detect button, show the pic on component FaceRecognition
  //clarifai API
  onButtonSumit = () => {
    this.setState({ imageUrl: this.state.input });
    const raw = JSON.stringify({
      user_app_id: {
        user_id: "5ywoo7mf28ur",
        app_id: "cb1c244432284b8388f59770b22af71d",
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key 9f798aa3abd84c58be8f6f39bdd22fa7",
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/face-detection/versions/45fb9a671625463fa646c3523a3087d5/outputs",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        var data = JSON.parse(result, null, 2);
        this.displayFaceBox(this.calculateFaceLocation(data));
      })
      .catch((error) => console.log("error", error));
  };

  initUrl = () => {
    this.setState({ imageUrl: "", box: {} });
  };

  onRouteChange = (inputRoute) => {
    if (inputRoute === "home") {
      this.setState({ isSignedIn: true });
    } else {
      this.setState({ isSignedIn: false });
    }
    this.setState({ route: inputRoute });
  };

  render() {
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          className="particles"
          options={particlesOptions}
        />
        <Nevigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
          initUrl={this.initUrl}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSumit={this.onButtonSumit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "register" ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
