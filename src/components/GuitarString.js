import React from 'react';
import { note, interval } from "@tonaljs/tonal";
import { entries } from "@tonaljs/scale-dictionary";
import { scale } from "@tonaljs/scale"
import { simplify, enharmonic } from "@tonaljs/note"

class GuitarString extends React.Component {

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
      let marked = [1,3,5,7,9,12,14]
      let frets = this.state.frets.map((aNote, i) => {
        let p = (this.props.validnotes.includes(aNote)) ? 'played' : 'notplayed'
        if (p === 'notplayed'){
          p = (this.props.validnotes.includes(enharmonic(aNote))) ? 'played' : 'notplayed'
        }
        let sm = marked.includes(i) ? 'small':'smallhide'
        if (i===0){
          return (<th key={'string'+i+aNote} class={p}><div class='bordercircle'></div><div class="stringnote">{aNote}</div></th>)
        }
        return (<td key={'string'+i+aNote} class={p}><div class='circle'></div><div class={sm}>{i}</div></td>)
      })
      return (<div key={'string'+this.props.stringkey}><table class='string'>
        <tr>
          {frets}
        </tr>
        </table></div>)
    }

    computeFrets = (rootNote) => {
      let root = note(rootNote)
      let oct = root.oct
      let str = root.letter
      let ns = []
      ns.push(simplify(root.name))
      for (var i = 0; i < 15; i++){
        str += '#'
        ns.push(simplify(str + oct))
      }
      this.setState({frets:ns})
    }


}

export default GuitarString;
