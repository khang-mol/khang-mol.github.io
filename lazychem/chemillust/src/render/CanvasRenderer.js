export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  };

  render(molecule) {
    const ctx = this.ctx;

    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // ctx.fillStyle = "red";
    // ctx.fillRect(20, 20, 50, 80);

    const atomMap = new Map(
      molecule.atoms.map(atom => [
        atom.id,
        atom,
      ])
    );

    for (const atom of molecule.atoms){
      ctx.beginPath();

      ctx.stroke();

      ctx.textAlign = "center";

      ctx.textBaseline = "middle";

      ctx.fillText(
        atom.element,
        atom.x,
        atom.y,
      );
    };
  };

  // resize() {
  //   const dpr = devicePixelRatio;
  //   this.canvas.width = this.canvas.clienWidth * dpr;
  //   this.canvas.height = this.canvas.clienHeight * dpr;
  //   this.ctx.scale(dpr, dpr);
  //   draw();
  // };
  // // addEventListener("resize", resize);

  // onResize = () => {resize};
}