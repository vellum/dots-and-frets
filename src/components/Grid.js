import React from 'react'
import { note, interval } from '@tonaljs/tonal'
import { entries } from '@tonaljs/scale-dictionary'
import { scale } from '@tonaljs/scale'
import { simplify, transposeBy, enharmonic } from '@tonaljs/note'
import GuitarString from './GuitarString'
import { chordType } from "@tonaljs/chord-dictionary"

class Grid extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        scales: entries(),
        selectedscale: 9,
        keyOf: 'D',
        rootNote: 'D3',
        actualscale: null,
        toots: [],
        selectedtuning: 3,
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
          ns.push(simplify(str + oct))
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
      newkey = enharmonic(newkey)
      this.setState({
        keyOf: newkey,
        rootNote: newkey+'3',
        toots: this.cornpute(newkey+'3')
      })

    }

    handleChange3 = (e) => {
      console.log(e.target.value)
      this.setState({
        selectedtuning : e.target.value
      })
    }
    getFormScales = (item, i) => {
      if (i===this.state.selectedscale){
        return <option value={i} selected>{item.name}</option>
      }
      return <option value={i}>{item.name}</option>
    }

    getFormKeys = (item, i) => {
      if (item.toUpperCase() === this.state.keyOf){
        return <option value={item} selected>{item}</option>
      }
      return <option value={item}>{item}</option>
    }

    getFormTunings = (item, i) => {
      if (i === this.state.selectedtuning){
        return <option value={i} selected>{item.name}</option>
      }
      return <option value={i}>{item.name}</option>
    }

    commaDelim = (thing, i) => {
        if (i===0){
          return thing
        }
        return ', '+thing
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

    printScaleDetail = (aScale) => {
      let theScale = scale( this.state.rootNote + ' ' + aScale.name)
      return(
        <div>
          <h3>scale</h3>
          <table>
            <tr><th>name</th><td>{theScale.name}</td></tr>
            <tr><th>type</th><td>{theScale.type}</td></tr>
            <tr><th>tonic</th><td>{theScale.tonic}</td></tr>
            <tr><th>notes</th><td>{this.printArray(theScale.notes)}</td></tr>
            <tr><th>intervals</th><td>{this.printArray(theScale.intervals)}</td></tr>
          </table>
        </div>
      )
    }

    printNotesInContext = (aScale) => {
      let theScale = scale( this.state.rootNote + ' ' + aScale.name)
      let root = note(this.state.rootNote)
      let toots = this.state.toots.map( (aNote, ind) => {

        let isPlayed = (theScale.notes.includes(enharmonic(aNote))) ? 'played' : 'notplayed'
        if (isPlayed==='notplayed'){
          isPlayed = (theScale.notes.includes(aNote)) ? 'played' : 'notplayed'
        }
        return (<div class={isPlayed}><div class='circle'></div><br/>{aNote}</div>)
      })
      return (
      <div>
        <h5>in context</h5>
        <div class='incontext'>{toots}</div>
        <div class='clear'/>
      </div>)
    }
    render() {
      let availablekeys = ['A','B','C','D','E','F','G']
      let scales = this.state.scales
      let selectedscale = this.state.selectedscale
      let form_scales = scales.map( (item, i) => this.getFormScales(item, i) )
      let form_keys = availablekeys.map( (item) => this.getFormKeys(item) )
      let scalename = this.state.scales[this.state.selectedscale].name

      let validnotes = []
      for (var ind = 0; ind < 6; ind++){
        let keyof = this.state.keyOf + '' + ind
        let thescale = scale( keyof + ' ' + scalename )
        for (var i=0;i<thescale.notes.length;i++){
          validnotes.push(thescale.notes[i])
        }
      }

      let availabletunings = this.state.tunings.map(
        (item,i) => this.getFormTunings(item,i)
      )

      let thetuning = this.state.tunings[this.state.selectedtuning]
      console.log(thetuning.strings)
      let thestrings = thetuning.strings
      return (
        <div>
            {this.printScaleDetail(this.state.scales[this.state.selectedscale])}
            {this.printNotesInContext(this.state.scales[this.state.selectedscale])}
            <div class="selector">
              <hr/>
              <p>Show me the <select onChange={this.handleChange}>{form_scales}</select> scale in <select onChange={this.handleChange2}>{form_keys}</select> for <select onChange={this.handleChange3}>{availabletunings}</select>
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
