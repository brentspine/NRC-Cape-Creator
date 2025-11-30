import { useEffect, useRef } from 'react'
import './App.css'
import CanvasRenderer from './utils/CanvasRenderer'
import Controls from './components/Controls'
import { useCapeState } from './hooks/useCapeState'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    frontImage,
    backImage,
    elytraImage,
    gradientColors,
    gradDirection,
    setFrontImage,
    setBackImage,
    setElytraImage,
    setGradientColors,
    setGradDirection,
    emojiEnabled,
    emoji,
    emojiSize,
    emojiSpacing,
    setEmojiEnabled,
    setEmoji,
    setEmojiSize,
    setEmojiSpacing,
    emojiOpacity,
    emojiRotation,
    emojiRandomRotation,
    emojiJitter,
    emojiApplyToElytra,
    emojiSeed,
    setEmojiOpacity,
    setEmojiRotation,
    setEmojiRandomRotation,
    setEmojiJitter,
    setEmojiApplyToElytra,
    setEmojiSeed,
    reset,
  } = useCapeState()

  const renderer = CanvasRenderer.getInstance()

  // Draw cape when state changes
  useEffect(() => {
    if (!canvasRef.current) return
    renderer.drawCape(
      canvasRef.current,
      frontImage,
      backImage,
      elytraImage,
      gradientColors,
      gradDirection,
      {
        emojiEnabled,
        emoji,
        emojiSize,
        emojiSpacing,
        emojiOpacity,
        emojiRotation,
        emojiRandomRotation,
        emojiJitter,
        emojiApplyToElytra,
        emojiSeed,
      }
    )
  }, [frontImage, backImage, elytraImage, gradientColors, gradDirection, emojiEnabled, emoji, emojiSize, emojiSpacing, emojiOpacity, emojiRotation, emojiRandomRotation, emojiJitter, emojiApplyToElytra, emojiSeed, renderer])

  // On first load, run the same routine as Reset
  useEffect(() => {
    // Trigger the same state logic as clicking Reset
    handleReset()
  }, [])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'custom_cape.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="wrapper">
      <div className="logo-container">
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="CLIENT CAPE Logo" className="logo-img" />
      </div>
      <div className="container">
        <Controls
          onFrontImageChange={setFrontImage}
          onBackImageChange={setBackImage}
          onElytraImageChange={setElytraImage}
          gradientColors={gradientColors}
          onGradientColorsChange={setGradientColors}
          gradDirection={gradDirection}
          onGradDirectionChange={setGradDirection}
          onDownload={handleDownload}
          onReset={handleReset}
          emojiEnabled={emojiEnabled}
          emoji={emoji}
          emojiSize={emojiSize}
          emojiSpacing={emojiSpacing}
          setEmojiEnabled={setEmojiEnabled}
          setEmoji={setEmoji}
          setEmojiSize={setEmojiSize}
          setEmojiSpacing={setEmojiSpacing}
          emojiOpacity={emojiOpacity}
          emojiRotation={emojiRotation}
          emojiRandomRotation={emojiRandomRotation}
          emojiJitter={emojiJitter}
          emojiApplyToElytra={emojiApplyToElytra}
          emojiSeed={emojiSeed}
          setEmojiOpacity={setEmojiOpacity}
          setEmojiRotation={setEmojiRotation}
          setEmojiRandomRotation={setEmojiRandomRotation}
          setEmojiJitter={setEmojiJitter}
          setEmojiApplyToElytra={setEmojiApplyToElytra}
          setEmojiSeed={setEmojiSeed}
        />
        <canvas
          ref={canvasRef}
          id="capeCanvas"
          width={512}
          height={256}
          className="cape-canvas"
        />
      </div>
    </div>
  )
}

export default App
