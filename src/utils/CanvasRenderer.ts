class CanvasRenderer {
  private static instance: CanvasRenderer | null = null
  private templateImg: HTMLImageElement | null = null
  private templateReady: boolean = false

  private readonly FRONT_X = 8
  private readonly FRONT_Y = 8
  private readonly FRONT_W = 80
  private readonly FRONT_H = 128

  private readonly BACK_X = 96
  private readonly BACK_Y = 8
  private readonly BACK_W = 80
  private readonly BACK_H = 128

  private readonly ELYTRA_X = 288
  private readonly ELYTRA_Y = 16
  private readonly ELYTRA_W = 80
  private readonly ELYTRA_H = 160

  private constructor() {
    this.initTemplate()
  }

  static getInstance(): CanvasRenderer {
    if (!CanvasRenderer.instance) {
      CanvasRenderer.instance = new CanvasRenderer()
    }
    return CanvasRenderer.instance
  }

  private initTemplate(): void {
    this.templateImg = new Image()
    // Try loading the template from the public folder using Vite base URL
    const templatePath = `${import.meta.env.BASE_URL}nrc_cape_template.png`
    const fallbackLogo = `${import.meta.env.BASE_URL}logo.svg`

    this.templateImg.src = templatePath
    this.templateImg.onload = () => {
      this.templateReady = true
    }
    // If the PNG is not found, try falling back to the project logo (SVG)
    this.templateImg.onerror = () => {
      // attempt fallback
      this.templateImg!.onerror = () => {
        this.templateReady = false
      }
      this.templateImg!.src = fallbackLogo
    }
  }

  drawCape(
    canvas: HTMLCanvasElement,
    frontImage: HTMLImageElement | null,
    backImage: HTMLImageElement | null,
    elytraImage: HTMLImageElement | null,
    gradientColors: string[],
    gradDirection: 'vertical' | 'horizontal',
    options?: {
      emojiEnabled?: boolean
      emoji?: string
      emojiSize?: number
      emojiSpacing?: number
      emojiOpacity?: number
      emojiRotation?: number
      emojiRandomRotation?: boolean
      emojiJitter?: number
      emojiApplyToElytra?: boolean
      emojiSeed?: number
      textColor?: string
      textStrokeEnabled?: boolean
      textStrokeColor?: string
      textStrokeWidth?: number
      textFont?: string
      textBold?: boolean
      textItalic?: boolean
    }
  ): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw template base if ready
    if (this.templateReady && this.templateImg) {
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(this.templateImg, 0, 0)
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    // Cape area: fill 0,0 to 176,136, gradient starts at 8,8
    const CAPE_FILL_X = 0
    const CAPE_FILL_Y = 0
    const CAPE_FILL_W = 176
    const CAPE_FILL_H = 136
    const CAPE_GRAD_START_X = 8
    const CAPE_GRAD_START_Y = 8
    const CAPE_GRAD_W = 168  // from 8 to 176
    const CAPE_GRAD_H = 128  // from 8 to 136
    const capeGradient = this.createGradientAt(ctx, CAPE_GRAD_START_X, CAPE_GRAD_START_Y, CAPE_GRAD_W, CAPE_GRAD_H, gradientColors, gradDirection)
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = capeGradient
    ctx.fillRect(CAPE_FILL_X, CAPE_FILL_Y, CAPE_FILL_W, CAPE_FILL_H)

    // Elytra area: fill 176,0 to 368,176, gradient starts at 272,16
    const ELYTRA_FILL_X = 176
    const ELYTRA_FILL_Y = 0
    const ELYTRA_FILL_W = 192  // from 176 to 368
    const ELYTRA_FILL_H = 176
    const ELYTRA_GRAD_START_X = 272
    const ELYTRA_GRAD_START_Y = 16
    const ELYTRA_GRAD_W = 96   // from 272 to 368
    const ELYTRA_GRAD_H = 160  // from 16 to 176
    const elytraGradient = this.createGradientAt(ctx, ELYTRA_GRAD_START_X, ELYTRA_GRAD_START_Y, ELYTRA_GRAD_W, ELYTRA_GRAD_H, gradientColors, gradDirection)
    ctx.fillStyle = elytraGradient
    ctx.fillRect(ELYTRA_FILL_X, ELYTRA_FILL_Y, ELYTRA_FILL_W, ELYTRA_FILL_H)

    // Draw emoji tiled pattern above the color but below user images
    if (options?.emojiEnabled && options?.emoji) {
      const emoji = options.emoji
      const size = options.emojiSize || 48
      const spacing = options.emojiSpacing || 64
      const opacity = typeof options.emojiOpacity === 'number' ? options.emojiOpacity : 1
      const baseRotation = options.emojiRotation || 0
      const randomRotation = !!options.emojiRandomRotation
      const jitter = options.emojiJitter || 0
      const applyToElytra = options.emojiApplyToElytra !== false
      const seed = options.emojiSeed || 0

      // Text style options
      const textColor = options.textColor || '#ffffff'
      const textStrokeEnabled = !!options.textStrokeEnabled
      const textStrokeColor = options.textStrokeColor || '#000000'
      const textStrokeWidth = options.textStrokeWidth || 2
      const textFont = options.textFont || 'sans-serif'
      const textBold = !!options.textBold
      const textItalic = !!options.textItalic

      ctx.save()
      ctx.globalAlpha = opacity

      // Build font string
      let fontStyle = ''
      if (textItalic) fontStyle += 'italic '
      if (textBold) fontStyle += 'bold '
      fontStyle += `${size}px `
      // Use emoji fonts for pure emoji (single emoji character), otherwise use selected font
      // Improved emoji detection: check if it's a single grapheme that is an emoji
      const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u
      const isEmoji = emojiRegex.test(emoji) && [...emoji].length <= 7 // ZWJ sequences can be long
      if (isEmoji) {
        fontStyle += '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
      } else {
        fontStyle += `"${textFont}", sans-serif`
      }
      ctx.font = fontStyle
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = textColor
      if (textStrokeEnabled) {
        ctx.strokeStyle = textStrokeColor
        ctx.lineWidth = textStrokeWidth
      }

      const rand = (x: number, y: number) => {
        // deterministic pseudo-random based on coordinates and seed
        const s = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
        return s - Math.floor(s)
      }

      // Emoji covers entire gradient area (cape + elytra = 0,0 to 368,176)
      const EMOJI_AREA_W = 368
      const EMOJI_AREA_H = 176

      for (let y = 0; y < EMOJI_AREA_H + spacing; y += spacing) {
        const rowIndex = Math.floor(y / spacing)
        const offset = (rowIndex % 2 === 0) ? 0 : spacing / 2
        for (let x = -spacing; x < EMOJI_AREA_W + spacing; x += spacing) {
          let px = x + offset + spacing / 2
          let py = y + spacing / 2

          // apply jitter
          if (jitter > 0) {
            const r = rand(px + 0.1, py + 0.2)
            const j = (r * 2 - 1) * jitter * spacing
            px += j
            py += (rand(px + 0.3, py + 0.4) * 2 - 1) * jitter * spacing
          }

          // Skip if not applying to elytra and the point intersects elytra region
          if (!applyToElytra) {
            if (
              px >= this.ELYTRA_X && px <= this.ELYTRA_X + this.ELYTRA_W &&
              py >= this.ELYTRA_Y && py <= this.ELYTRA_Y + this.ELYTRA_H
            ) {
              continue
            }
          }

          // rotation
          let angleDeg = baseRotation
          if (randomRotation) {
            angleDeg = (rand(px + 0.5, py + 0.6) * 360) - 180
          }
          const angle = (angleDeg * Math.PI) / 180

          ctx.save()
          ctx.translate(px, py)
          if (angle !== 0) ctx.rotate(angle)
          if (textStrokeEnabled) {
            ctx.strokeText(emoji as string, 0, 0)
          }
          ctx.fillText(emoji as string, 0, 0)
          ctx.restore()
        }
      }

      ctx.restore()
    }

    // Draw template on top
    if (this.templateReady && this.templateImg) {
      ctx.globalCompositeOperation = 'destination-over'
      ctx.drawImage(this.templateImg, 0, 0)
    }

    ctx.globalCompositeOperation = 'source-over'

    // Draw user images
    if (frontImage) {
      ctx.drawImage(frontImage, this.FRONT_X, this.FRONT_Y, this.FRONT_W, this.FRONT_H)
    }
    if (backImage) {
      ctx.drawImage(backImage, this.BACK_X, this.BACK_Y, this.BACK_W, this.BACK_H)
    }

    // Draw elytra with masking
    if (elytraImage && this.templateReady && this.templateImg) {
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = this.ELYTRA_W
      maskCanvas.height = this.ELYTRA_H
      const maskCtx = maskCanvas.getContext('2d')
      if (!maskCtx) return

      maskCtx.drawImage(
        this.templateImg,
        this.ELYTRA_X,
        this.ELYTRA_Y,
        this.ELYTRA_W,
        this.ELYTRA_H,
        0,
        0,
        this.ELYTRA_W,
        this.ELYTRA_H
      )

      const elyCanvas = document.createElement('canvas')
      elyCanvas.width = this.ELYTRA_W
      elyCanvas.height = this.ELYTRA_H
      const elyCtx = elyCanvas.getContext('2d')
      if (!elyCtx) return

      elyCtx.drawImage(elytraImage, 0, 0, this.ELYTRA_W, this.ELYTRA_H)
      elyCtx.globalCompositeOperation = 'destination-in'
      elyCtx.drawImage(maskCanvas, 0, 0)

      ctx.drawImage(elyCanvas, this.ELYTRA_X, this.ELYTRA_Y)
    }
  }

  private createGradientAt(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
    direction: 'vertical' | 'horizontal'
  ): CanvasGradient {
    let gradient: CanvasGradient

    if (direction === 'vertical') {
      gradient = ctx.createLinearGradient(x, y, x, y + height)
    } else {
      gradient = ctx.createLinearGradient(x, y, x + width, y)
    }

    if (colors.length === 0) {
      gradient.addColorStop(0, '#002aff')
      gradient.addColorStop(1, '#002aff')
    } else if (colors.length === 1) {
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(1, colors[0])
    } else {
      const n = colors.length - 1
      colors.forEach((color, i) => {
        gradient.addColorStop(i / n, color)
      })
    }

    return gradient
  }
}

export default CanvasRenderer
