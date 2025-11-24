/**
 * Gets a random avatar URL from the public/avatars folder
 * @returns Promise<string | null> - The public URL of a random avatar, or null if none found
 */
export async function getRandomAvatar(): Promise<string | null> {
  try {
    // List of available avatars in the public/avatars folder
    const avatars = [
      'bear.png',
      'chicken.png',
      'dog (1).png',
      'dog.png',
      'jaguar.png',
      'rabbit.png',
      'sea-lion.png'
    ]

    if (avatars.length === 0) {
      console.warn('No avatars found in public/avatars folder')
      return null
    }

    // Pick a random avatar
    const randomIndex = Math.floor(Math.random() * avatars.length)
    const randomAvatar = avatars[randomIndex]

    console.log(`Selected random avatar: ${randomAvatar}`)

    // Return the public URL path
    const avatarUrl = `/avatars/${randomAvatar}`
    console.log(`Generated avatar URL: ${avatarUrl}`)

    return avatarUrl
  } catch (error) {
    console.error('Error getting random avatar:', error)
    return null
  }
}

