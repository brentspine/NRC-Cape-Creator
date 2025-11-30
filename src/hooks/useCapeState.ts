import { useState } from 'react'

export const useCapeState = () => {
  const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null)
  const [backImage, setBackImage] = useState<HTMLImageElement | null>(null)
  const [elytraImage, setElytraImage] = useState<HTMLImageElement | null>(null)
  const [gradientColors, setGradientColors] = useState<string[]>(['#ffffff'])
  const [gradDirection, setGradDirection] = useState<'vertical' | 'horizontal'>('vertical')
  const [emojiEnabled, setEmojiEnabled] = useState<boolean>(false)
  const [emoji, setEmoji] = useState<string>('')
  const [emojiSize, setEmojiSize] = useState<number>(48)
  const [emojiSpacing, setEmojiSpacing] = useState<number>(64)
  const [emojiOpacity, setEmojiOpacity] = useState<number>(1)
  const [emojiRotation, setEmojiRotation] = useState<number>(0)
  const [emojiRandomRotation, setEmojiRandomRotation] = useState<boolean>(false)
  const [emojiJitter, setEmojiJitter] = useState<number>(0)
  const [emojiApplyToElytra, setEmojiApplyToElytra] = useState<boolean>(true)
  const [emojiSeed, setEmojiSeed] = useState<number>(0)

  const reset = () => {
    setFrontImage(null)
    setBackImage(null)
    setElytraImage(null)
    setGradientColors(['#ffffff'])
    setGradDirection('vertical')
    setEmojiEnabled(false)
    setEmoji('')
    setEmojiSize(48)
    setEmojiSpacing(64)
    setEmojiOpacity(1)
    setEmojiRotation(0)
    setEmojiRandomRotation(false)
    setEmojiJitter(0)
    setEmojiApplyToElytra(true)
    setEmojiSeed(0)
  }

  return {
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
    emojiOpacity,
    emojiRotation,
    emojiRandomRotation,
    emojiJitter,
    emojiApplyToElytra,
    emojiSeed,
    setEmojiEnabled,
    setEmoji,
    setEmojiSize,
    setEmojiSpacing,
    setEmojiOpacity,
    setEmojiRotation,
    setEmojiRandomRotation,
    setEmojiJitter,
    setEmojiApplyToElytra,
    setEmojiSeed,
    reset,
  }
}
