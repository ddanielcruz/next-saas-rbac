export function getNameInitials(name: string, size: number = 2) {
  return (
    name
      .split(' ')
      .map((word) => word.charAt(0))
      // Avoid name initials with lowercase letters (e.g., Daniel de Almeida -> DA)
      .filter((letter) => letter.trim().length > 0 && letter[0].toUpperCase() === letter[0])
      .join('')
      .toUpperCase()
      .slice(0, size)
  );
}
