import React from 'react'
import { note, interval, distance } from '@tonaljs/tonal'
import { entries } from '@tonaljs/scale-dictionary'
import { scale } from '@tonaljs/scale'
import { simplify, enharmonic } from '@tonaljs/note'
import GuitarString from './GuitarString'
import NotesView from './NotesView'
import SemitoneView from './SemitoneView'

// TODO: Highlight root notes
// TODO: select and visualize sequences
class Grid extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        scales: entries(),
        selectedscale: 0,
        keyOf: 'E',
        rootNote: 'E3',
        actualscale: null,
        toots: [],
        selectedtuning: 0,
        tunings:[
          { name: 'E Standard', strings: [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ] },
          { name: 'D Standard', strings: [ 'D2', 'G2', 'C3', 'F3', 'A3', 'D4' ] },
          { name: 'Open E', strings: [ 'E2', 'B2', 'E3', 'G#3', 'B3', 'E4' ] },
          { name: 'Open D', strings: [ 'D2', 'A2', 'D3', 'F#3', 'A3', 'D4' ] },
          { name: 'Open C#', strings: [ 'C#2', 'G#2', 'C#3', 'F3', 'G#3', 'C#4' ] },
          { name: 'Open C (Low)', strings: [ 'C2', 'G2', 'C3', 'E3', 'G3', 'C4' ] }
        ]
      }
    }

    componentDidMount() {
      this.setState({ toots: this.cornpute(this.state.rootNote) })
    }

    cornpute = (roo) => {
        let root = note(roo)
        let oct = root.oct
        let str = root.letter
        let ns = []
        ns.push(simplify(root.name))
        for (var i = 0; i < 11; i++){
          str += '#'
          let aNote = note(str)
          ns.push(simplify(enharmonic(aNote) + oct))
        }
        return ns
    }

    handleChange = (event) => {
        this.setState({
          selectedscale: event.target.value
        });
    }

    handleChange2 = (e) => {
      let newkey = e.target.value
      newkey = newkey.toUpperCase()
      this.setState({
        keyOf: newkey,
        rootNote: newkey+'3',
        toots: this.cornpute(newkey+'3')
      })
    }

    handleChange3 = (e) => {
      this.setState({
        selectedtuning : e.target.value
      })
    }

    getFormScales = (item, i) => {
      return <option key={'form_scales_' + i} value={i}>{item.name}</option>
    }

    getFormKeys = (item, i) => {
      let str = item.toUpperCase()
      return <option key={'form_keys_' + i} value={str}>{str}</option>
    }

    getFormTunings = (item, i) => {
      return <option key={'form_tunings_' + i} value={i}>{item.name}</option>
    }

    commaDelim = (thing, i) => {
        if (i===0){
          return thing
        }
        return ', '+thing
    }

    printNotes = (arr) => {
      let ret = ''
      for (var i = 0; i < arr.length; i++) {
        let o = note(arr[i])
        //console.log(o)
        o = o.name
        if (i===0) {
          ret += o
        } else {
          ret += ' ' + o
        }
      }
      return ret
    }

    printNotesAsSteps = (arr) => {
      let ret = ''
      for (var i = 0; i < arr.length; i++) {
        let o = note(arr[i])
        o = o.step
        if (i===0) {
          ret += o
        } else {
          ret += ' ' + o
        }
      }
      return ret
    }

    printNotesAsStepChanges = (arr) => {
      let ret = ''
      let prev = note(arr[0]).name
      for (var i = 1; i < arr.length; i++) {
        let o = note(arr[i])
        let n = o.name
        console.log(o)
        let delta = distance(prev, n)
        let ivl = interval(delta).semitones
        ret += ' ' + ivl
        prev = n
      }

      return ret
    }

    printArray = (arr) => {
      let ret = ''
      for (var i = 0; i < arr.length; i++) {
        let o = arr[i]
        if (i===0) {
          ret += o
        } else {
          ret += ' ' + o
        }
      }
      return ret
    }

    printScaleDetail = (aScale, validnotes) => {
      let theScale = scale( this.state.rootNote + ' ' + aScale.name)
      let theNote = note(this.state.rootNote)
      return(
        <div className='scaledetail'>
          <h3>{theScale.type} in {enharmonic(theNote.pc)}</h3>
          <table>
            <tbody>
            <tr><th>notes</th><td>

                  <NotesView stringkey={'notes'} scale={aScale} rootNote={simplify(theNote.letter+theNote.acc)} validnotes={validnotes} scalename={''} />

            </td></tr>
            <tr className="semitone_row"><th>Semitone changes</th><td><SemitoneView scale={aScale}/></td></tr>
            </tbody>
          </table>
        </div>
      )
    }


    render() {

      // shortcuts
      let scales = this.state.scales
      let selectedscale = this.state.selectedscale
      let availablekeys = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
      let scalename = scales[selectedscale].name
      let availabletunings = this.state.tunings.map(
        (item,i) => this.getFormTunings(item,i)
      )
      let thetuning = this.state.tunings[this.state.selectedtuning]
      let thestrings = thetuning.strings

      // turn arrays into form field html gunk
      let form_scales = scales.map( (item, i) => this.getFormScales(item, i) )
      let form_keys = availablekeys.map( (item, i) => this.getFormKeys(item, i) )

      // compute the valid notes (dark dots) for each of the strings
      let validnotes = []
      let validnotesPC = []
      let numstrings = 6
      for (var ind = 0; ind < numstrings; ind++){
        let keyof = this.state.keyOf + '' + ind
        let thescale = scale( keyof + ' ' + scalename )
        for (var i=0;i<thescale.notes.length;i++){
          let aNote = note(thescale.notes[i])
          validnotes.push(thescale.notes[i])
          validnotesPC.push(aNote.pc)
        }
      }

      return (
        <div>
            {this.printScaleDetail(this.state.scales[this.state.selectedscale], validnotesPC)}
            <div className="selector">
              <p>Show me the
              <select key='select_scale' defaultValue={this.state.selectedscale} onChange={this.handleChange}>{form_scales}</select> scale in the key of
              <select key='select_key' defaultValue={this.state.keyOf} onChange={this.handleChange2}>{form_keys}</select> for
              <select key='select_tuning' defaultValue={this.state.selectedtuning} onChange={this.handleChange3}>{availabletunings}</select> tuning
              </p>
            </div>
            <GuitarString stringkey={'string5'} rootNote={thestrings[5]} validnotes={validnotes} scalename={scalename} />
            <GuitarString stringkey={'string4'} rootNote={thestrings[4]} validnotes={validnotes} scalename={scalename} />
            <GuitarString stringkey={'string3'} rootNote={thestrings[3]} validnotes={validnotes} scalename={scalename} />
            <GuitarString stringkey={'string2'} rootNote={thestrings[2]} validnotes={validnotes} scalename={scalename} />
            <GuitarString stringkey={'string1'} rootNote={thestrings[1]} validnotes={validnotes} scalename={scalename} />
            <GuitarString stringkey={'string0'} rootNote={thestrings[0]} validnotes={validnotes} scalename={scalename} />
        </div>
      )
    }
}

export default Grid;
