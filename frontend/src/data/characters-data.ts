// Expanded character database with 100 fictional characters
export const characterNames = [
  "Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Darth Vader",
  "Luke Skywalker", "Princess Leia", "Han Solo", "Frodo Baggins", "Gandalf",
  "Aragorn", "Legolas", "Bilbo Baggins", "Katniss Everdeen", "Peeta Mellark",
  "President Snow", "Sherlock Holmes", "John Watson", "James Bond", "Indiana Jones",
  "Batman", "Superman", "Wonder Woman", "The Joker", "Harley Quinn",
  "Spider-Man", "Iron Man", "Captain America", "Hulk", "Thor",
  "Black Widow", "Loki", "Thanos", "Naruto Uzumaki", "Sasuke Uchiha",
  "Sakura Haruno", "Kakashi Hatake", "Monkey D. Luffy", "Roronoa Zoro", "Nami",
  "Sanji", "Light Yagami", "L Lawliet", "Goku", "Vegeta",
  "Piccolo", "Ash Ketchum", "Pikachu", "Mario", "Luigi",
  "Princess Peach", "Bowser", "Link", "Zelda", "Ganondorf",
  "Kratos", "Atreus", "Master Chief", "Cortana", "Geralt of Rivia",
  "Yennefer", "Ciri", "Eren Yeager", "Mikasa Ackerman", "Armin Arlert",
  "Levi Ackerman", "Rick Grimes", "Michonne", "Homer Simpson", "Bart Simpson",
  "Lisa Simpson", "SpongeBob SquarePants", "Patrick Star", "Squidward Tentacles", "Shrek",
  "Donkey", "Fiona", "Elsa", "Anna", "Olaf",
  "Aang", "Zuko", "Katara", "Sokka", "Walter White",
  "Jesse Pinkman", "Saul Goodman", "Eleven", "Mike Wheeler", "Vecna",
  "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Arya Stark", "Sonic the Hedgehog",
  "Dr. Eggman", "Lara Croft", "Nathan Drake", "Joel Miller", "Ellie Williams"
];

// Helper to generate base attributes for characters based on their properties
export const generateCharacterAttributes = (name: string): Record<string, number> => {
  const attrs: Record<string, number> = {};
  
  // All are fictional
  attrs[1] = 0;
  attrs[3] = 2; // All are famous
  
  // Categorize by media type and traits
  const movieChars = ["Darth Vader", "Luke Skywalker", "Princess Leia", "Han Solo", "Indiana Jones", "James Bond", "Batman", "Superman", "Wonder Woman", "The Joker", "Harley Quinn", "Spider-Man", "Iron Man", "Captain America", "Hulk", "Thor", "Black Widow", "Loki", "Thanos", "Katniss Everdeen", "Peeta Mellark", "Shrek", "Donkey", "Fiona", "Elsa", "Anna", "Olaf"];
  const bookChars = ["Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Frodo Baggins", "Gandalf", "Aragorn", "Legolas", "Bilbo Baggins", "Sherlock Holmes", "John Watson"];
  const gameChars = ["Mario", "Luigi", "Princess Peach", "Bowser", "Link", "Zelda", "Ganondorf", "Kratos", "Atreus", "Master Chief", "Cortana", "Geralt of Rivia", "Yennefer", "Ciri", "Lara Croft", "Nathan Drake", "Joel Miller", "Ellie Williams", "Sonic the Hedgehog", "Dr. Eggman"];
  const animeChars = ["Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake", "Monkey D. Luffy", "Roronoa Zoro", "Nami", "Sanji", "Light Yagami", "L Lawliet", "Goku", "Vegeta", "Piccolo", "Ash Ketchum", "Pikachu", "Eren Yeager", "Mikasa Ackerman", "Armin Arlert", "Levi Ackerman"];
  const tvChars = ["Walter White", "Jesse Pinkman", "Saul Goodman", "Eleven", "Mike Wheeler", "Vecna", "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Arya Stark", "Rick Grimes", "Michonne", "Homer Simpson", "Bart Simpson", "Lisa Simpson", "SpongeBob SquarePants", "Patrick Star", "Squidward Tentacles", "Aang", "Zuko", "Katara", "Sokka"];
  
  const heroes = ["Harry Potter", "Luke Skywalker", "Frodo Baggins", "Aragorn", "Katniss Everdeen", "Batman", "Superman", "Wonder Woman", "Spider-Man", "Iron Man", "Captain America", "Thor", "Naruto Uzumaki", "Monkey D. Luffy", "Goku", "Mario", "Link", "Kratos", "Master Chief", "Geralt of Rivia", "Ash Ketchum", "Aang"];
  const villains = ["Darth Vader", "The Joker", "Loki", "Thanos", "President Snow", "Bowser", "Ganondorf", "Dr. Eggman", "Light Yagami", "Vecna"];
  const magicUsers = ["Harry Potter", "Hermione Granger", "Gandalf", "Albus Dumbledore", "Elsa", "Naruto Uzumaki", "Goku", "Aang"];
  const maskWearers = ["Darth Vader", "Batman", "Spider-Man", "Iron Man", "Master Chief", "Kakashi Hatake"];
  
  // Set attributes based on categories
  if (movieChars.includes(name)) attrs[4] = 2;
  if (bookChars.includes(name)) attrs[12] = 2;
  if (gameChars.includes(name)) attrs[9] = 2;
  if (animeChars.includes(name) || tvChars.includes(name)) attrs[4] = 2;
  
  if (heroes.includes(name)) attrs[5] = 2;
  if (villains.includes(name)) { attrs[5] = -2; attrs[11] = 2; }
  if (magicUsers.includes(name)) { attrs[6] = 1; attrs[15] = 2; }
  if (maskWearers.includes(name)) attrs[14] = 2;
  
  return attrs;
};
