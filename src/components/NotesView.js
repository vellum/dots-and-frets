import React from 'react';
import { note, interval } from "@tonaljs/tonal";
import { simplify, enharmonic } from "@tonaljs/note"

class NotesView extends React.Component {

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
        let slots = []
        let semitones = this.state.semitones
        let slotnote = this.props.rootNote
        for (var i = 0; i < 12; i++){
            slots.push({
              truth:semitones.includes(i),
              note: simplify(slotnote)
            })
            slotnote += '#'
        }
        let ret = slots.map((o, i) => {
          let p = (o.truth) ? 'played' : 'notplayed'
          return (<div key={'slot'+i} class={p + ' incontext'} style={{ float:'left', width: '1.3em'}}><div style={{fontSize:'50%'}} class='circle'></div><div class={'small'} style={{marginTop:'-0.025em'}}>{o.note}</div></div>)
        })
        return (<div key={'string'+this.props.stringkey} class='NotesView'>
            {ret}
          </div>)
      }

}
export default NotesView;
