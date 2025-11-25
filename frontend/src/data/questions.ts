export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface Character {
  id: number;
  name: string;
  attributes: Record<string, number>; // question_id -> answer weight (-2 to 2)
  image?: string;
  quote: string;
}

export const questions: Question[] = [
  { id: 1, text: "Is this person real?", category: "general" },
  { id: 2, text: "Is this person alive?", category: "general" },
  { id: 3, text: "Is this person famous?", category: "general" },
  { id: 4, text: "Is this person from a movie or TV show?", category: "media" },
  { id: 5, text: "Is this person a hero?", category: "personality" },
  { id: 6, text: "Does this person have superpowers?", category: "abilities" },
  { id: 7, text: "Is this person known for music?", category: "profession" },
  { id: 8, text: "Is this person known for sports?", category: "profession" },
  { id: 9, text: "Is this person from a video game?", category: "media" },
  { id: 10, text: "Is this person known for comedy?", category: "personality" },
  { id: 11, text: "Is this person a villain?", category: "personality" },
  { id: 12, text: "Is this person from a book series?", category: "media" },
  { id: 13, text: "Is this person known for technology?", category: "profession" },
  { id: 14, text: "Does this person wear a mask or costume?", category: "appearance" },
  { id: 15, text: "Is this person associated with magic?", category: "abilities" },
];

import { characterNames, generateCharacterAttributes } from "./characters-data";

// Character quotes database
const characterQuotes: Record<string, string> = {
  "Harry Potter": "I solemnly swear I am up to no good.",
  "Hermione Granger": "When in doubt, go to the library.",
  "Ron Weasley": "Bloody brilliant!",
  "Albus Dumbledore": "Happiness can be found in the darkest of times.",
  "Darth Vader": "I am your father.",
  "Luke Skywalker": "I'm a Jedi, like my father before me.",
  "Princess Leia": "Help me, Obi-Wan Kenobi. You're my only hope.",
  "Han Solo": "Never tell me the odds.",
  "Frodo Baggins": "I will take the Ring to Mordor.",
  "Gandalf": "You shall not pass!",
  "Aragorn": "My friends, you bow to no one.",
  "Legolas": "They're taking the Hobbits to Isengard!",
  "Bilbo Baggins": "I'm going on an adventure!",
  "Katniss Everdeen": "May the odds be ever in your favor.",
  "Peeta Mellark": "If we burn, you burn with us.",
  "President Snow": "Hope is the only thing stronger than fear.",
  "Sherlock Holmes": "Elementary, my dear Watson.",
  "John Watson": "The game is afoot!",
  "James Bond": "Bond. James Bond.",
  "Indiana Jones": "It belongs in a museum!",
  "Batman": "I'm Batman.",
  "Superman": "Truth, justice, and the American way.",
  "Wonder Woman": "I will fight for those who cannot fight for themselves.",
  "The Joker": "Why so serious?",
  "Harley Quinn": "I'm not a lady, I'm a Harley!",
  "Spider-Man": "With great power comes great responsibility.",
  "Iron Man": "I am Iron Man.",
  "Captain America": "I can do this all day.",
  "Hulk": "Hulk smash!",
  "Thor": "For Asgard!",
  "Black Widow": "I've got red in my ledger.",
  "Loki": "I am burdened with glorious purpose.",
  "Thanos": "I am inevitable.",
  "Naruto Uzumaki": "Believe it!",
  "Sasuke Uchiha": "I've been waiting for this.",
  "Sakura Haruno": "I'm not a little girl anymore!",
  "Kakashi Hatake": "In the ninja world, those who break the rules are scum.",
  "Monkey D. Luffy": "I'm gonna be King of the Pirates!",
  "Roronoa Zoro": "I'm going to be the world's greatest swordsman!",
  "Nami": "I'll draw a map of the whole world!",
  "Sanji": "I'll find All Blue!",
  "Light Yagami": "I am justice!",
  "L Lawliet": "I'm Justice, and I'm going to win.",
  "Goku": "It's over 9000!",
  "Vegeta": "I am the prince of all Saiyans!",
  "Piccolo": "Dodge!",
  "Ash Ketchum": "I wanna be the very best!",
  "Pikachu": "Pika pika!",
  "Mario": "It's-a me, Mario!",
  "Luigi": "Let's-a go!",
  "Princess Peach": "Thank you, Mario!",
  "Bowser": "Bwahaha!",
  "Link": "Hyah!",
  "Zelda": "The fate of Hyrule rests with you.",
  "Ganondorf": "This world will be mine!",
  "Kratos": "Boy!",
  "Atreus": "Father!",
  "Master Chief": "I need a weapon.",
  "Cortana": "Don't make a girl a promise you can't keep.",
  "Geralt of Rivia": "Hmm.",
  "Yennefer": "Magic is chaos, art, and science.",
  "Ciri": "I'm not a monster.",
  "Eren Yeager": "I will keep moving forward.",
  "Mikasa Ackerman": "If we don't fight, we can't win.",
  "Armin Arlert": "Someone who can't sacrifice anything can't change anything.",
  "Levi Ackerman": "Give up on your dreams and die.",
  "Rick Grimes": "We are the walking dead.",
  "Michonne": "We don't kill the living.",
  "Homer Simpson": "D'oh!",
  "Bart Simpson": "Eat my shorts!",
  "Lisa Simpson": "If anyone wants me, I'll be in my room.",
  "SpongeBob SquarePants": "I'm ready!",
  "Patrick Star": "Is mayonnaise an instrument?",
  "Squidward Tentacles": "I hate all of you.",
  "Shrek": "What are you doing in my swamp?",
  "Donkey": "I'm making waffles!",
  "Fiona": "I'm a princess!",
  "Elsa": "Let it go!",
  "Anna": "Do you want to build a snowman?",
  "Olaf": "I like warm hugs.",
  "Aang": "I'm the Avatar!",
  "Zuko": "That's rough, buddy.",
  "Katara": "Hope is something you give yourself.",
  "Sokka": "It's boomerang time!",
  "Walter White": "I am the one who knocks.",
  "Jesse Pinkman": "Yeah, science!",
  "Saul Goodman": "Better call Saul!",
  "Eleven": "Friends don't lie.",
  "Mike Wheeler": "Friends don't lie.",
  "Vecna": "Your time is up.",
  "Jon Snow": "I know nothing.",
  "Daenerys Targaryen": "I am the blood of the dragon.",
  "Tyrion Lannister": "I drink and I know things.",
  "Arya Stark": "Not today.",
  "Sonic the Hedgehog": "Gotta go fast!",
  "Dr. Eggman": "I hate that hedgehog!",
  "Lara Croft": "I make my own luck.",
  "Nathan Drake": "Sic parvis magna.",
  "Joel Miller": "Endure and survive.",
  "Ellie Williams": "I'm gonna find and kill every last one of them."
};

export const characters: Character[] = characterNames.map((name, index) => ({
  id: index + 1,
  name,
  quote: characterQuotes[name] || "...",
  attributes: generateCharacterAttributes(name),
}));

export const getAnswerWeight = (answer: string): number => {
  switch (answer) {
    case "yes":
      return 2;
    case "probably-yes":
      return 1;
    case "maybe":
      return 0;
    case "probably-no":
      return -1;
    case "no":
      return -2;
    default:
      return 0;
  }
};
