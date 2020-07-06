import React from 'react';
import { note } from "@tonaljs/tonal";
import { simplify, enharmonic } from "@tonaljs/note"

class NotesView extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        frets: []
      }
    }
    componentDidMount() {
      this.computeFrets(this.props.rootNote)
    }
    componentWillReceiveProps(nextProps){
      this.computeFrets(nextProps.rootNote)
    }
    render() {
      let frets = this.state.frets.map((aNote, i) => {
        let p = (this.props.validnotes.includes(aNote)) ? 'played' : 'notplayed'
        if (p === 'notplayed'){
          p = (this.props.validnotes.includes(enharmonic(aNote))) ? 'played' : 'notplayed'
        }
        return (<div key={'string'+i+aNote} class={p} style={{ margin:'0.2em'
          , float:'left'}}><div class='circle'></div><div class={'small'}>{enharmonic(aNote)}</div></div>)
      })
      return (<div key={'string'+this.props.stringkey} class='NotesView'>
          {frets}
        </div>)
    }
    // this gets an 11 note sequence beginning with the root note
    computeFrets = (rootNote) => {
      let root = note(rootNote)
      let str = root.pc
      let ns = [] // new state
      for (var i = 0; i < 13; i++){
        ns.push(note(simplify(str)).pc)
        str += '#'
      }
      this.setState({frets:ns})
    }
}
export default NotesView;
