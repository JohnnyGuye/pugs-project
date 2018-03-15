import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

let PI2 = Math.PI * 2;
let HALFPI = Math.PI / 2;

class Wave {
  constructor(
    public timeModifier: number = 1,
    public lineWidth: number = 2,
    public amplitude: number = 50,
    public wavelength: number = 50,
    public segmentLength: number = 10,
    public color: any = 'rgba(255,255,255,.2)') {

    }

}

@Component({
  selector: 'wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.css']
})
export class WaveComponent implements OnInit {

  static readonly DEFAULT_OPTIONS = {
    speed: -2,
    amplitude: 50,
    wavelength: 50,
    segmentLength: 10,
    lineWidth: 2,
    color: 'rgba(255,255,255,.2)'
  }
  @ViewChild("holder") holder: ElementRef;
  @ViewChild("waves") canvas: ElementRef;
  context: CanvasRenderingContext2D;

  private _options: any = WaveComponent.DEFAULT_OPTIONS;
  @Input()
  set options(op: any) {
    for(let o in op)
      this._options[o] = op[o];
  }
  get options() { return this._options; }

  @Input()
  waves: Array<Wave> = [
    new Wave(1, 3, 150, 200, 20, 'rgba(255, 255, 255, 0.5)'),
    new Wave(1, 2, 150, 100, 10, 'rgba(255, 255, 255, 0.3)'),
    new Wave(1, 1, -150, 50, 10, 'rgba(255, 255, 255, 0.2)'),
    new Wave(1, .5, -100, 100, 10, 'rgba(255, 255, 255, 0.1)')
  ];

  width: number;
  height: number;
  dpr: number;

  waveWidth: number;
  waveLeft: number;

  private starttime: number;
  private prevtime: number;
  private get ellapsed() {
    let curtime = Date.now()
    let elap = curtime - this.prevtime
    this.prevtime = curtime
    return elap / 1000
  }
  private get ellapsedSinceStart() {
    return (Date.now() - this.starttime) / 1000
  }

  constructor() { }

  ngOnInit() {
    this.starttime = this.prevtime = Date.now()
    if(!this.canvas) { throw "No Canvas Selected"; }
    this.context = this.canvas.nativeElement.getContext('2d');

    if(!this.waves.length) { throw "No waves specified"; }

    // Internal
    this._resizeWidth();
    window.addEventListener('resize', () => { this._resizeWidth });
    // User
    this.resizeEvent();
    window.addEventListener('resize', () => { this.resizeEvent });

    // Start the magic
    this.loop();
  }

  resizeEvent() {
    var gradient = this.context.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0,"rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.5,"rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1,"rgba(0, 0, 0, 0)");

    var index = -1;
    var length = this.waves.length;
    while(++index < length){
      this.waves[index].color = gradient;
    }

    // Clean Up
    index = void 0;
    length = void 0;
    gradient = void 0;
  }

  // fill the screen
  private _resizeWidth() {
    this.dpr = window.devicePixelRatio || 1;

    let el = this.canvas.nativeElement;

    this.width = el.width = this.holder.nativeElement.clientWidth;
    this.height = el.height = this.holder.nativeElement.clientHeight;
    // el.style.width = window.innerWidth + 'px';
    // el.style.height = window.innerHeight + 'px';
    console.log(this.width, this.height, this.context)

    this.waveWidth = this.width * 0.95;
    this.waveLeft = this.width * 0.025;
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  update(delta: number = this.ellapsedSinceStart) {

    var index = -1;
    var length = this.waves.length;

    while(++index < length) {
      let timeModifier = this.waves[index].timeModifier
      this.drawSine(delta * timeModifier, this.waves[index]);
    }

    index = void 0;
    length = void 0;
  }


  ease(percent, amplitude) : number {
    return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5;
  }

  drawSine (delta: number, options: any = {}) {
    let amplitude = options.amplitude         || this.options.amplitude;
    let wavelength = options.wavelength       || this.options.wavelength;
    let lineWidth = options.lineWidth         || this.options.lineWidth;
    let color = options.color                 || this.options.color;
    let segmentLength = options.segmentLength || this.options.segmentLength;

    var x = delta;
    var y = 0;
    var amp = this.options.amplitude;

    // Center the waves
    var yAxis = this.height / 2;

    // Styles
    this.context.lineWidth = lineWidth * this.dpr;
    this.context.strokeStyle = color;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.beginPath();

    // Starting Line
    this.context.moveTo(0, yAxis);
    this.context.lineTo(this.waveLeft, yAxis);

    for(var i = 0; i < this.waveWidth; i += segmentLength) {
      x = (delta * this.options.speed) + (-yAxis + i) / wavelength;
      y = Math.sin(x);

      // Easing
      amp = this.ease(i / this.waveWidth, amplitude);

      this.context.lineTo(i + this.waveLeft, amp * y + yAxis);

      amp = void 0;
    }

    // Ending Line
    this.context.lineTo(this.width, yAxis);

    // Stroke it
    this.context.stroke();

    // Clean up
    options = void 0;
    amplitude = void 0;
    wavelength = void 0;
    lineWidth = void 0;
    color = void 0;
    segmentLength = void 0;
    x = void 0;
    y = void 0;
  }

  loop() {
    this.clear();
    this.update();

    requestAnimationFrame(() => { this.loop() });
  }
}
