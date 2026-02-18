
import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, ChangeDetectionStrategy, inject, NgZone } from '@angular/core';

declare const THREE: any;

@Component({
  selector: 'app-particle-background',
  standalone: true,
  template: `<canvas #canvas class="absolute top-0 left-0 w-full h-full -z-10"></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticleBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  private ngZone = inject(NgZone);

  private camera!: any;
  private scene!: any;
  private renderer!: any;
  private particles!: any;
  private mouseX = 0;
  private mouseY = 0;
  private animationFrameId!: number;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
        this.initThree();
        this.animate();
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('mousemove', this.onDocumentMouseMove);
      if (this.renderer) {
        this.renderer.dispose();
      }
    });
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const numParticles = 5000;

    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x4f46e5, size: 2 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onDocumentMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX - window.innerWidth / 2;
    this.mouseY = event.clientY - window.innerHeight / 2;
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.render();
  }

  private render(): void {
    const time = Date.now() * 0.00005;
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    
    this.particles.rotation.x = time * 0.2;
    this.particles.rotation.y = time * 0.5;

    this.renderer.render(this.scene, this.camera);
  }
}
