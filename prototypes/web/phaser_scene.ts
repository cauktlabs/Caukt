/**
 * Phaser scene sketch — dawn market hall with falling-price stalls.
 * Mirrors the live client at caukt.fun. Kept here so the public repo has a
 * runnable reference for the parallax + stall layout.
 */

import Phaser from "phaser";

export interface StallSpec {
  id: string;
  symbol: string;
  tint: number;
}

const WORLD_WIDTH = 3840;
const WORLD_HEIGHT = 720;
const PLAYER_SPEED = 360;
const FLOOR_Y = WORLD_HEIGHT - 20;

export class MarketSceneProto extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stalls: Array<{
    x: number;
    sprite: Phaser.GameObjects.Rectangle;
    label: Phaser.GameObjects.Text;
    spec: StallSpec;
  }> = [];

  constructor() {
    super({ key: "MarketSceneProto" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0A1424");
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.buildStalls([
      { id: "caukt", symbol: "$caukt", tint: 0xd4a943 },
      { id: "sol", symbol: "SOL", tint: 0x5bc0eb },
      { id: "nft", symbol: "NFT", tint: 0xe63946 },
      { id: "fish", symbol: "DAWN", tint: 0xa5d8e6 },
      { id: "meme", symbol: "MEME", tint: 0x06a77d },
    ]);
    this.spawnPlayer();

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update(_time: number, deltaMs: number) {
    const dt = deltaMs / 1000;
    let vx = 0;
    if (this.cursors.left?.isDown) vx -= PLAYER_SPEED;
    if (this.cursors.right?.isDown) vx += PLAYER_SPEED;
    this.player.x += vx * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 40, WORLD_WIDTH - 40);
    this.cameras.main.scrollX = Phaser.Math.Clamp(
      this.player.x - this.cameras.main.width / 2,
      0,
      WORLD_WIDTH - this.cameras.main.width,
    );
  }

  private buildStalls(defs: StallSpec[]) {
    const spacing = (WORLD_WIDTH - 500) / defs.length;
    defs.forEach((spec, i) => {
      const x = 350 + i * spacing;
      const sprite = this.add.rectangle(x, FLOOR_Y, 140, 180, spec.tint);
      sprite.setOrigin(0.5, 1);
      const label = this.add
        .text(x, FLOOR_Y - 200, spec.symbol, {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#F5F5F0",
        })
        .setOrigin(0.5, 1);
      this.stalls.push({ x, sprite, label, spec });
    });
  }

  private spawnPlayer() {
    this.player = this.add.rectangle(380, FLOOR_Y - 40, 26, 56, 0xf5f5f0);
    this.player.setStrokeStyle(2, 0x1a2e4a);
  }
}
