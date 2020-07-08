import React from 'react';
import { interval } from "@tonaljs/tonal";

class SemitoneView extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        semitones:[]
      }
    }


    componentDidMount() {
      this.compute(this.props)
    }

    componentWillReceiveProps(nextProps){
      this.compute(nextProps)
    }

    compute = (p) => {

      let semitones = p.scale.intervals.map((ivl) => {
          return interval(ivl).semitones
      })
      this.setState({
          semitones: semitones
      })
    }

    render() {
      let prev = 0
      let ret = this.state.semitones.map((st, i)=>{
        let diff = st-prev
        prev = st
        return <div style={{fontSize:'75%', float:'left', margin:'0.4em'}}>{diff}</div>
      })
      return (<div>{ret}</div>)
    }

}

export default SemitoneView;
