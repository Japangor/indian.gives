import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// A sample of Bhagavad Gita verses (add more verses for better matching)
const VERSES = [
    {
      "index": 1,
      "text": "1:1  Dhritarastra said: O Sanjaya, what did my sons and the sons of Pandu actually do when, eager for battle, they gathered together on the holy field of Kuruksetra?"
    },
    {
      "index": 2,
      "text": "1:2  Sanjaya said: But then, seeing the army of the Pandavas in battle array, King Duryodhana approached his teacher (Dronacharya) and spoke the following words:"
    },
    {
      "index": 3,
      "text": "1:3  O teacher, (please) see this vast army of the sons of Pandu, arrayed for battle by the son of Drupada, your intelligent disciple, Dhrishtadyumna."
    },
    {
      "index": 4,
      "text": "1:4  There are in this army, heroes wielding great bows, and equal in military prowess to Bhima and Arjuna: Yuyudhana (Satyaki) and Virata, and the maharatha (great chariot-rider) Drupada;"
    },
    {
      "index": 5,
      "text": "1:5  Dhrstaketu, Cekitana, and the valiant king of Kasi (Varanasi); Purujit and Kuntibhoja, and Saibya, the choicest among men;"
    },
    {
      "index": 6,
      "text": "1:6  And the chivalrous Yudhamanyu, and the valiant Uttamaujas; son of Subhadra (Abhimanyu) and the sons of Draupadi all (of whom) are, verily, maharathas."
    },
    {
      "index": 7,
      "text": "1:7  But, O best among the Brahmanas, please be appraised of those who are foremost among us, the principal warriors of my army. I speak of them to you by way of example."
    },
    {
      "index": 8,
      "text": "1:8  (They are:) Your venerable self, Bhisma and Karna, and Krpa who is ever victorious in battle; Asvatthama, Vikarna, Saumadatti and Jayadratha."
    },
    {
      "index": 9,
      "text": "1:9  There are many heroes who have dedicated their lives for my sake, who possess various kinds of weapons and missiles, (and) all of whom are skilled in battle."
    },
    {
      "index": 10,
      "text": "1:10  Therefore, our army under the complete protection of Bhisma and others is unlimited. But the army of these (enemies), under the protection of Bhima and others is limited."
    },
    {
      "index": 11,
      "text": "1:11  However, venerable sirs, all of you without exception, while occupying all the positions in the different directions as allotted (to you respectively), please fully protect Bhisma in particular."
    },
    {
      "index": 12,
      "text": "1:12  The valiant grandfather, the eldest of the Kurus, loudly sounding a lion-roar, blew the conch to raise his (Duryodhana's) spirits."
    },
    {
      "index": 13,
      "text": "1:13  Just immediately after that conchs and kettledrums, and tabors, trumpets and cow-horns blared forth. That sound became tumultuous."
    },
    {
      "index": 14,
      "text": "1:14  Then, Madhava (Krishna) and the son of Pandu (Arjuna), stationed in their magnificent chariot with white horses attached to it, loudly blew their divine conchs."
    },
    {
      "index": 15,
      "text": "1:15  Hrsikesa (Krishna) blew the conch Pancajanya; Dhananjaya (Arjuna) (the conch) Devadatta; and Vrkodara (Bhima) of terrible deeds blew the great conch Paundra;"
    },
    {
      "index": 16,
      "text": "1:16  King Yudhisthira, son of Kunti, (blew) the Anantavijaya; Nakula and Sahadeva, the Sughosa and the Manipuspaka (respectively)."
    },
    {
      "index": 17,
      "text": "1:17  And the King of Kasi, wielding a great bow, and the great chariot-rider Sikhandi, Dhrstadyumna and Virata, and Satyaki the unconquered;"
    },
    {
      "index": 18,
      "text": "1:18  Drupada and the sons of Draupadi, and the son of Subhadra, (Abhimanyu) the mighty-armed all (of them) together, O king, blew their respective conchs."
    },
    {
      "index": 19,
      "text": "1:19  That tremendous sound pierced the hearts of the sons of Dhrtarastra as it reverberated through the sky and the earth."
    },
    {
      "index": 20,
      "text": "1:20  O king, thereafter, seeing Dhrtarastra's men standing in their positions, when all the weapons were ready for action, the son of Pandu (Arjuna) who had the insignia of Hanuman on his chariot-flag, raising up his bow, said the following to Hrsikesa."
    },
    {
      "index": 21,
      "text": "1:21  Arjuna said: O Acyuta, please place my chariot between both the armies."
    },
    {
      "index": 22,
      "text": "1:22  And keep it there until I survey these who stand intent on fighting, and those who are going to engage in battle with me in this impending war."
    },
    {
      "index": 23,
      "text": "1:23  These who have assembled here and want to accomplish in the war what is dear to the perverted son of Dhrtarastra, I find them to be intent on fighting."
    },
    {
      "index": 24,
      "text": "1:24  Sanjay said: O scion of the line of Bharata (Dhrtararastra), Hrsikesa, being told so by Gudakesa (Arjuna), placed the excellent chariot between the two armies."
    },
    {
      "index": 25,
      "text": "1:25  In front of Bhisma and Drona as also all the rulers of the earth, and said, 'O Partha (Arjuna), see these assembled people of the Kuru dynasty.'"
    },
    {
      "index": 26,
      "text": "1:26  Then Partha (Arjuna) saw, marshalled among both the armies, (his) uncles as also grandfathers, teachers, maternal uncles, brothers (and (cousins), sons, grandsons, as well as comrades and fathers-in-law and friends."
    },
    {
      "index": 27,
      "text": "1:27  The son of Kunti (Ajuna), seeing all those relatives arrayed (there), became overwhelmed by supreme compassion and said this sorrowfully:"
    },
    {
      "index": 28,
      "text": "1:28  Arjuna said: O Krsna, seeing these relatives and friends who have assembled here with the intention of fighting, my limbs give way and my mouth becomes completely dry."
    },
    {
      "index": 29,
      "text": "1:29  And there is trembling in my body, and there are cold shivers; the Gandiva (bow) slips from the hand and even the skin burns intensely."
    },
    {
      "index": 30,
      "text": "1:30  Moreover, O Kesava (Krsna), I am not able to stand firmly, and my mind seems to be whirling. And I notice the omens to be adverse."
    },
    {
      "index": 31,
      "text": "1:31  Besides, I do not see any good (to be derived) from killing my own people in battle. O Krsna, I do not desire victory, nor even a kingdom nor pleasures."
    },
    {
      "index": 32,
      "text": "1:32  I desire not victory, O Krishna, nor kingdom, nor pleasures. Of what avail is dominion to us, O Krishna, or pleasures or even life?"
    },
    {
      "index": 33,
      "text": "1:33  Those for whose sake we desire kingdom, enjoyments and pleasures, stand here in battle, having renounced life and wealth."
    },
    {
      "index": 34,
      "text": "1:34  Teachers, fathers, sons and also grandfathers, maternal uncles, fathers-in-law, grandsons, brothers-in-law and other relatives."
    },
    {
      "index": 35,
      "text": "1:35  O Madhusudana, even if I am killed, I do not want to kill these even for the sake of a kingdom extending over the three worlds; what to speak of doing so for the earth!"
    },
    {
      "index": 36,
      "text": "1:36  O Janardana, what happiness shall we derive by killing the sons of Dhrtarastra? Sin alone will accrue to us by killing these felons."
    },
    {
      "index": 37,
      "text": "1:37  Therefore, it is not proper for us to kill the sons of Dhrtarastra who are our own relatives. For, O Madhava, how can we be happy by killing our kinsmen?"
    },
    {
      "index": 38,
      "text": "1:38  O Janardana, although these people, whose hearts have become perverted by greed, do not see the evil arising from destroying the family and sin in hostility towards, friends,"
    },
    {
      "index": 39,
      "text": "1:39  yet how can we who clearly see the evil arising from destroying the family remain unaware of (the need of) abstaining from this sin?"
    },
    {
      "index": 40,
      "text": "1:40  From the ruin of the family are totally destroyed the traditional rites and duties of the family. When rites and duties are destroyed, vice overpowers the entire family also."
    },
    {
      "index": 41,
      "text": "1:41  O Krsna, when vice predominates, the women of the family become corrupt. O descendent of the Vrsnis, when women become corrupted, it results in the intermingling of castes."
    },
    {
      "index": 42,
      "text": "1:42  And the intermingling in the family leads the ruiners of the family verily into hell. The forefathers of these fall down (into hell) because of being deprived of the offerings of rice-balls and water."
    },
    {
      "index": 43,
      "text": "1:43  Due to these misdeeds of the ruiners of the family, which cause intermingling of castes, the traditional rites and duties of the castes and families become destroyed."
    },
    {
      "index": 44,
      "text": "1:44  O Janardana, we have heard that living in hell becomes inevitable for those persons whose family duties get destroyed."
    },
    {
      "index": 45,
      "text": "1:45  What a pity that we have resolved to commit a great sin by being eager to kill our own kith and kin, out of greed for the pleasures of a kingdom!"
    },
    {
      "index": 46,
      "text": "1:46  If, in this battle, the sons of Dhrtarastra armed with weapons kill me who am non-resistant and unarmed, that will be more beneficial to me."
    },
    {
      "index": 47,
      "text": "1:47  Sanjaya narrated: Having said so, Arjuna, with a mind afflicted with sorrow, sat down on the chariot in the midst of the battle, casting aside the bow along with the arrows."
    },
    {
      "index": 48,
      "text": "2:1  Sanjaya said: To him who had been thus filled with pity, whose eyes were filled with tears and showed distress, and who was sorrowing, Madhusudana uttered these words:"
    },
    {
      "index": 49,
      "text": "2:2  The Blessed Lord said: O Arjuna, how has this infatuation overtaken you at this odd hour? It is shunned by noble souls; neither will it bring heaven, nor fame to you."
    },
    {
      "index": 50,
      "text": "2:3  O Partha, yield not to unmanliness. This does not befit you. O scorcher of foes, arise, giving up the petty weakness of the heart."
    },
    {
      "index": 51,
      "text": "2:4  Arjuna said: O Madhusudana, O destroyer of enemies, how can I fight with arrows in battle against Bhisma and Drona who are worthy of adoration?"
    },
    {
      "index": 52,
      "text": "2:5  Rather than killing the noble-minded elders, it is better in this world to live even on alms. But, by killing the elders we shall only be enjoying here the pleasures of wealth and desirable things drenched in blood."
    },
    {
      "index": 53,
      "text": "2:6  We do not know this as well as to which is the better for us, (and) whether we shall win, or whether they shall conquer us. Those very sons of Dhrtarastra, by killing whom we do not wish to live, stand in confrontation."
    },
    {
      "index": 54,
      "text": "2:7  With my nature overpowered by weak compassion, with a mind bewildered about duty, I pray to You. Tell me for certain that which is better; I am Your disciple. Instruct me who have taken refuge in You."
    },
    {
      "index": 55,
      "text": "2:8  Because, I do not see that which can, even after acquiring on this earth a prosperous kingdom free from enemies and even sovereignty over the gods, remove my sorrow (which is) blasting the senses."
    },
    {
      "index": 56,
      "text": "2:9  Sanjaya said: Having spoken thus to Hrsikesa (Krsna), Gudakesa (Arjuna), the afflicter of foes, verily became silent, telling Govinda, 'I shall not fight.'"
    },
    {
      "index": 57,
      "text": "2:10  O descendant of Bharata, to him who was sorrowing between the two armies, Hrsikesa, mocking as it were, said these words:"
    },
    {
      "index": 58,
      "text": "2:11  The Blessed Lord said: You grieve for those who are not to be grieved for; and you speak words of wisdom! The learned do not grieve for the departed and those who have not departed."
    },
    {
      "index": 59,
      "text": "2:12  But certainly (it is) not (a fact) that I did not exist at any time; nor you, nor these rulers of men. And surely it is not that we all shall cease to exist after this."
    },
    {
      "index": 60,
      "text": "2:13  As are boyhood, youth and decay to an embodied being in this (present) body, similar is the acquisition of another body. This being so, an intelligent person does not get deluded."
    },
    {
      "index": 61,
      "text": "2:14  But the contacts of the organs with the objects are the producers of cold and heat, happiness and sorrow. They have a beginning and an end, (and) are transient. Bear them, O descendant of Bharata."
    },
    {
      "index": 62,
      "text": "2:15  O (Arjuna, who are) foremost among men, verily, the person whom these do not torment, the wise man to whom sorrow and happiness are the same he is fit for Immortality."
    },
    {
      "index": 63,
      "text": "2:16  Of the unreal there is no being; the real has no nonexistence. But the nature of both these, indeed, has been realized by the seers of Truth."
    },
    {
      "index": 64,
      "text": "2:17  But know That to be indestructible by which all this is pervaded. None can bring about the destruction of this Immutable."
    },
    {
      "index": 65,
      "text": "2:18  These destructible bodies are said to belong to the everlasting, indestructible, indeterminable, embodied One. Therefore, O descendant of Bharata, join the battle."
    },
    {
      "index": 66,
      "text": "2:19  He who thinks of this One as the killer, and he who thinks of this One as the killed both of them do not know. This One does not kill, nor is It killed."
    },
    {
      "index": 67,
      "text": "2:20  Never is this One born, and never does It die; nor is it that having come to exist, It will again cease to be. This One is birthless, eternal, undecaying, ancient; It is not killed when the body is killed."
    },
    {
      "index": 68,
      "text": "2:21  O Partha, he who knows this One as indestructible, eternal, birthless and undecaying, how and whom does that person kill, or whom does he cause to be killed!"
    },
    {
      "index": 69,
      "text": "2:22  As after rejecting worn-out clothes a man takes up other new ones, likewise after rejecting worn-out bodies the embodied one unites with other new ones."
    },
    {
      "index": 70,
      "text": "2:23  Weapons do not cut It, fire does not burn It, water does not moisten It, and air does not dry It."
    },
    {
      "index": 71,
      "text": "2:24  It cannot be cut, It cannot be burnt, cannot be moistened, and surely cannot be dried up. It is eternal, omnipresent, stationary, unmoving and changeless."
    },
    {
      "index": 72,
      "text": "2:25  It is said that This is unmanifest; This is inconceivable; This is unchangeable. Therefore, having known This thus, you ought not to grieve."
    },
    {
      "index": 73,
      "text": "2:26  On the other hand, if you think this One is born continually or dies constantly, even then, O mighty-armed one, you ought not to grieve thus."
    },
    {
      "index": 74,
      "text": "2:27  For death of anyone born is certain, and of the dead (re-) birth is a certainly. Therefore, you ought not to grieve over an inevitable fact."
    },
    {
      "index": 75,
      "text": "2:28  O descendant of Bharata, all beings remain unmanifest in the beginning; they become manifest in the middle. After death, they certainly become unmanifest. What lamentation can there be with regard to them?"
    },
    {
      "index": 76,
      "text": "2:29  Someone visualizes It as a wonder; and similarly indeed, someone else talks of It as a wonder; and someone else hears of It as a wonder. And someone else, indeed, does not realize It even after hearing about It."
    },
    {
      "index": 77,
      "text": "2:30  O descendant of Bharata, this embodied Self existing in everyone's body can never be killed. Therefore, you ought not to grieve for all (these) beings."
    },
    {
      "index": 78,
      "text": "2:31  Even considering your own duty you should not waver, since there is nothing else better for a Ksatriya than a righteous battle."
    },
    {
      "index": 79,
      "text": "2:32  O son of Partha, happy are the Ksatriyas who come across this kind of a battle, which presents itself unsought for and which is an open gate to heaven."
    },
    {
      "index": 80,
      "text": "2:33  On the other hand, if you will not fight this righteous battle, then, forsaking your own duty and fame, you will incur sin."
    },
    {
      "index": 81,
      "text": "2:34  People also will speak of your unending infamy. And to an honoured person infamy is worse than death."
    },
    {
      "index": 82,
      "text": "2:35  The great chariot-riders will think of you as having desisted from the fight out of fear; and you will into disgrace before them to whom you had been estimable."
    },
    {
      "index": 83,
      "text": "2:36  And your enemies will speak many indecent words while denigrating your might. What can be more painful than that?"
    },
    {
      "index": 84,
      "text": "2:37  Either by being killed you will attain heaven, or by winning you will enjoy the earth. Therefore, O Arjuna, rise up with determination for fighting."
    },
    {
      "index": 85,
      "text": "2:38  Treating happiness and sorrow, gain and loss, and victory and defeat with equality, engage in battle. Thus, you will not incur sin."
    },
    {
      "index": 86,
      "text": "2:39  O Partha, this wisdom has been imparted to you from the standpoint of Self-realization. But listen to this (wisdom) from the standpoint of Yoga, endowed with which wisdom you will get rid of the bondage of action."
    },
    {
      "index": 87,
      "text": "2:40  Here there is no waste of an attempt; nor is there (any) harm. Even a little of this righteousness saves (one) from great fear."
    },
    {
      "index": 88,
      "text": "2:41  O scion of the Kuru dynasty, in this there is a single, one-pointed conviction. The thoughts of the irresolute ones have many branches indeed, and are innumerable."
    },
    {
      "index": 89,
      "text": "2:42  O son of Prtha, those undiscerning people who utter this flowery talk which promises birth as a result of rites and duties, and is full of various special rites meant for the attainment of enjoyment and affluence, remain engrossed in the utterances of the Vedas and declare that nothing else exists; their minds are full of desires and they have heaven as the goal."
    },
    {
      "index": 90,
      "text": "2:43  O son of Prtha, those undiscerning people who utter this flowery talk which promises birth as a result of rites and duties, and is full of various special rites meant for the attainment of enjoyment and affluence, remain engrossed in the utterances of the Vedas and declare that nothing else exists; their minds are full of desires and they have heaven as the goal."
    },
    {
      "index": 91,
      "text": "2:44  One-pointed conviction does not become established in the minds of those who delight in enjoyment and affluence, and whose intellects are carried away by that (speech)."
    },
    {
      "index": 92,
      "text": "2:45  O Arjuna, the Vedas [Meaning only the portion dealing with rites and duties (karma-kanda)] have the three Gunas(modes of Prakriti) as their object. You become free from worldliness, free from the pairs of duality, established in the Eternal Existence(God), without (desire for) acquisition and protection, and self-collected."
    },
    {
      "index": 93,
      "text": "2:46  A Brahmana with realization has that much utility in all the Vedas as a man has in a well when there is a flood all around."
    },
    {
      "index": 94,
      "text": "2:47  Your right is for action alone, never for the results. Do not become the agent of the results of action. May you not have any inclination for inaction."
    },
    {
      "index": 95,
      "text": "2:48  By being established in Yoga, O Dhananjaya (Arjuna), undertake actions, casting off attachment and remaining equipoised in success and failure. Evenness of mind is called Yoga."
    },
    {
      "index": 96,
      "text": "2:49  O Dhananjaya, indeed, action with a self-motive is far inferior to the yoga of wisdom. Take resort to wisdom. Those who thirst for rewards are pitiable."
    },
    {
      "index": 97,
      "text": "2:50  Possessed of wisdom, one rejects here both virtue and vice. Therefore, devote yourself to (Karma-) yoga. Yoga is skilfulness in action."
    },
    {
      "index": 98,
      "text": "2:51  Because, those who are devoted to wisdom, (they) becoming men of Enlightenment by giving up the fruits produced by actions, reach the state beyond evils by having become freed from the bondage of birth."
    },
    {
      "index": 99,
      "text": "2:52  When your mind will go beyond the turbidity of delusion, then you will acquire dispassion for what has to be heard and what has been heard."
    },
    {
      "index": 100,
      "text": "2:53  When your mind that has become bewildered by hearing will become unshakable and steadfast in the Self, then you will attain Yoga that arises from discrimination."
    },
    {
      "index": 101,
      "text": "2:54  Arjuna said: O Kesava, what is the description of a man of steady wisdom who is Self-absorbed? How does the man of steady wisdom speak? How does he sit? How does he move about?"
    },
    {
      "index": 102,
      "text": "2:55  The Blessed said: O Partha, when one fully renounces all the desires that have entered the mind, and remains satisfied in the Self alone by the Self, then he is called a man of steady wisdom."
    },
    {
      "index": 103,
      "text": "2:56  That monk is called a man of steady wisdom when his mind is unperturbed in sorrow, he is free from longing for delights, and has gone beyond attachment, fear and anger."
    },
    {
      "index": 104,
      "text": "2:57  The wisdom of that person remains established who has not attachment for anything anywhere, who neither welcomes nor rejects anything whatever good or bad when he comes across it."
    },
    {
      "index": 105,
      "text": "2:58  And when this one fully withdraws the senses from the objects of the senses, as a tortoise wholly (withdraws) the limbs, then his wisdom remains established."
    },
    {
      "index": 106,
      "text": "2:59  The objects recede from an abstinent man, with the exception of the taste (for them). Even the taste of this person falls away after realization of the Absolute."
    },
    {
      "index": 107,
      "text": "2:60  For, O son of Kunti, the turbulent organs violently snatch away the mind of an intelligent person, even while he is striving diligently."
    },
    {
      "index": 108,
      "text": "2:61  Controlling all of them, one should remain concentrated on Me as the supreme. For, the wisdom of one whose organs are under control becomes steadfast."
    },
    {
      "index": 109,
      "text": "2:62  In the case of a person who dwells on objects, there arises attachment for them. From attachment grows hankering, from hankering springs anger."
    },
    {
      "index": 110,
      "text": "2:63  From anger follows delusion; from delusion, failure of memory; from failure of memory, the loss of understanding; from the loss of understanding, he perishes."
    },
    {
      "index": 111,
      "text": "2:64  But by perceiving objects with the organs that are free from attraction and repulsion, and are under his own control, the self-controlled man attains serenity."
    },
    {
      "index": 112,
      "text": "2:65  When there is serenity, there follows eradication of all his sorrows, because the wisdom of one who has a serene mind soon becomes firmly established."
    },
    {
      "index": 113,
      "text": "2:66  For the unsteady there is no wisdom, and there is no meditation for the unsteady man. And for an unmeditative man there is no peace. How can there be happiness for one without peace?"
    },
    {
      "index": 114,
      "text": "2:67  For, the mind which follows in the wake of the wandering senses, that (mind) carries away his wisdom like the mind (diverting) a boat on the waters."
    },
    {
      "index": 115,
      "text": "2:68  Therefore, O mighty-armed one, his wisdom becomes established whose organs in all their varieties are withdrawn from their objects."
    },
    {
      "index": 116,
      "text": "2:69  The self-restrained man keeps awake during that which is night for all creatures. That during which creatures keep awake, it is night to the seeing sage."
    },
    {
      "index": 117,
      "text": "2:70  That man attains peace into whom all desires enter in the same way as the waters flow into a sea that remains unchanged (even) when being filled up from all sides. Not so one who is desirous of objects."
    },
    {
      "index": 118,
      "text": "2:71  That man attains peace who, after rejecting all desires, moves about free from hankering, without the idea of ('me' and) 'mine', and devoid of pride."
    },
    {
      "index": 119,
      "text": "2:72  O Partha, this is the state of being established in Brahman. One does not become deluded after attaining this. One attains identification with Brahman by being established in this state even in the closing years of one's life."
    },
    {
      "index": 120,
      "text": "3:1  Arjuna said: O Janardana (Krsna), if it be Your opinion that wisdom is superior to action, why then, do you urge me to do horrible action, O Kesava?"
    },
    {
      "index": 121,
      "text": "3:2  You bewilder my understanding, as it were, by a seemingly conflicting statement! Tell me for certain one of these by which I may attain the highest Good."
    },
    {
      "index": 122,
      "text": "3:3  The Blessed Lord said: O unblemished one, two kinds of steadfastness in this world were spoken of by Me in the days of yore-through the Yoga of Knowledge for the men of realization; through the Yoga of Action for the yogis."
    },
    {
      "index": 123,
      "text": "3:4  A person does not attain freedom from action by abstaining from action; nor does he attain fulfilment merely through renunciation."
    },
    {
      "index": 124,
      "text": "3:5  Because, no one ever remains even for a moment without doing work. For all are made to work under compulsion by the gunas born of Nature."
    },
    {
      "index": 125,
      "text": "3:6  One, who after withdrawing the organs of action, sits mentally recollecting the objects of the senses, that one, of deluded mind, is called a hypocrite."
    },
    {
      "index": 126,
      "text": "3:7  But, O Arjuna, one who engages in Karma-yoga with the organs of action, controlling the organs with the mind and becoming unattached-that one excels."
    },
    {
      "index": 127,
      "text": "3:8  You perform the obligatory duties, for action is superior to inaction. And, through inaction, even the maintenance of your body will not be possible."
    },
    {
      "index": 128,
      "text": "3:9  This man becomes bound by actions other than that action meant for God. Without being attached, O son of Kunti, you perform actions for Him."
    },
    {
      "index": 129,
      "text": "3:10  In the days of yore, having created the beings together with the sacrifices, Prajapati said: 'By this you multiply. Let this be your yielder of coveted objects of desire.'"
    },
    {
      "index": 130,
      "text": "3:11  'You nourish the gods with this. Let those gods nourish you. Nourishing one another, you shall attain the supreme Good.'"
    },
    {
      "index": 131,
      "text": "3:12  'Being nourished by sacrifices, the gods will indeed give you the coveted enjoyments. He is certainly a thief who enjoys what have been given by them without offering (these) to them.'"
    },
    {
      "index": 132,
      "text": "3:13  By becoming partakers of the remembers of sacrifices, they become freed from all sins. But the unholy persons who cook for themselves, they incur sin."
    },
    {
      "index": 133,
      "text": "3:14  From food are born the creatures; the origin of food is from rainfall; rainfall originates from sacrifice; sacrifice has action as its origin."
    },
    {
      "index": 134,
      "text": "3:15  Know that actin has the Veda as its origin; the Vedas has the Immutable as its source. Hence, the all-pervading Veda is for ever based on sacrifice."
    },
    {
      "index": 135,
      "text": "3:16  O Partha, he lives in vain who does not follow here the wheel thus set in motion, whose life is sinful, and who indulges in the senses."
    },
    {
      "index": 136,
      "text": "3:17  But that man who rejoices only in the Self and is satisfied with the Self, and is contented only in the Self-for him there is no duty to perform."
    },
    {
      "index": 137,
      "text": "3:18  For him there is no concern here at all with performing action; nor any (concern) with non-performance. Moreover, for him there is no dependence on any object to serve any purpose."
    },
    {
      "index": 138,
      "text": "3:19  Therefore, remaining unattached, always perform the obligatory duty, for, by performing (one's) duty without attachment, a person attains the Highest."
    },
    {
      "index": 139,
      "text": "3:20  For Janaka and others strove to attain Liberation through action itself. You ought to perform (your duties) keeping also in view the prevention of mankind from going astray."
    },
    {
      "index": 140,
      "text": "3:21  Whatever a superior person does, another person does that very thing! Whatever he upholds as authority, an ordinary person follows that."
    },
    {
      "index": 141,
      "text": "3:22  In all the three worlds, O Partha, there is no duty whatsoever for Me (to fulfil); nothing remains unachieved or to be achieved. (Still) I continue in action."
    },
    {
      "index": 142,
      "text": "3:23  For, O Partha, if at any time I do not continue vigilantly in action, men will follow My path in every way."
    },
    {
      "index": 143,
      "text": "3:24  These worlds will be ruined if I do not perform action. And I shall become the agent of intermingling (of castes), and shall be destroying these beings."
    },
    {
      "index": 144,
      "text": "3:25  O scion of the Bharata dynasty, as the unenlightened people act with attachment to work, so should the enlightened person act, without attachment, being desirous of the prevention of people from going astray."
    },
    {
      "index": 145,
      "text": "3:26  The enlightened man should not create disturbance in the beliefs of the ignorant, who are attached to work. Working, while himself remaining diligent, he should make them do all the duties."
    },
    {
      "index": 146,
      "text": "3:27  While actions are being done in every way by the gunas (qualities) of Nature, one who is deluded by egoism thinks thus: 'I am the doer.'"
    },
    {
      "index": 147,
      "text": "3:28  But, O mighty-armed one, the one who is a knower of the facts about the varieties of the gunas and actions does not become attached, thinking thus: 'The organs rest (act) on the objects of the organs.'"
    },
    {
      "index": 148,
      "text": "3:29  Those who are wholly deluded by the gunas of Nature become attached to the activities of the gunas. The knower of the All should not disturb those of dull intellect, who do not know the All."
    },
    {
      "index": 149,
      "text": "3:30  Devoid of the fever of the soul, engage in battle by dedicating all actions to Me, with (your) mind intent on the Self, and becoming free from expectations and egoism."
    },
    {
      "index": 150,
      "text": "3:31  Those men who ever follow this teaching of Mine with faith and without cavil, they also become freed from actions."
    },
    {
      "index": 151,
      "text": "3:32  But those who, decaying [Finding fault where there is none.] this, do not follow My teaching, know them-who are deluded about all knowledge [Knowledge concerning the qualified and the un-qualified Brahman.] and who are devoid of discrimination-to have gone to ruin."
    },
    {
      "index": 152,
      "text": "3:33  Even a man of wisdom behaves according to his own nature. Beings follow (their) nature. What can restraint do?"
    },
    {
      "index": 153,
      "text": "3:34  Attraction and repulsion are ordained with regard to the objects of all the organs. One should not come under the sway of these two, because they are his adversaries."
    },
    {
      "index": 154,
      "text": "3:35  One's own duty [Customary or scripturally ordained observances of different castes and sects.], though defective, is superior to another's duty well-performed. Death is better while engaged in one's own duty; another's duty is fraught with fear."
    },
    {
      "index": 155,
      "text": "3:36  Arjuna said: Now then, O scion of the Vrsni dynasty (Krsna), impelled by what does this man commit sin even against his wish, being constrained by force, as it were?"
    },
    {
      "index": 156,
      "text": "3:37  The Blessed Lord said: This desire, this anger, born of the guna of rajas, is a great devourer, a great sinner. Know this to be the enemy here."
    },
    {
      "index": 157,
      "text": "3:38  As fire is enveloped by smoke, as a mirror by dirt, and as a foetus remains enclosed in the womb, so in this shrouded by that."
    },
    {
      "index": 158,
      "text": "3:39  O son of Kunti, Knowledge is covered by this constant enemy of the wise in the form of desire, which is an insatiable fire."
    },
    {
      "index": 159,
      "text": "3:40  The organs, mind, and the intellect are said to be its abode. This one diversely deludes the embodied being by veiling Knowledge with the help of these."
    },
    {
      "index": 160,
      "text": "3:41  Therefore, O scion of the Bharata dynasty, after first controlling the organs, renounce this one which is sinful and a destroyer of learning and wisdom."
    },
    {
      "index": 161,
      "text": "3:42  They say that the organs are superior (to the gross body); the mind is superior to the organs; but the intellect is superior to the mind. However, the one who is superior to the intellect is He."
    },
    {
      "index": 162,
      "text": "3:43  Understanding the Self thus [Understanding thus: that desires can be conquered through the knowledge of the Self.] as superior to the intellect, and completely establishing (the Self) is spiritual absorption with the (help of) the mind, O mighty-armed one, vanish the enemy in the form of desire, which is difficult to subdue."
    },
    {
      "index": 163,
      "text": "4:1  The Blessed Lord said: I imparted this imperishable Yoga to Vivasvan(Sun-God), Vivasvan taught this to Manu, and Manu transmitted this to Iksavaku."
    },
    {
      "index": 164,
      "text": "4:2  The king-sages knew this (yoga) which was received thus in regular succession. That Yoga, O destroyer of foes, in now lost owing to a long lapse of time."
    },
    {
      "index": 165,
      "text": "4:3  That ancient Yoga itself, which is this, has been taught to you by Me today, considering that you are My devotee and friend, For, this (Yoga) is a profound secret."
    },
    {
      "index": 166,
      "text": "4:4  Arjuna said: Your birth was later, (whereas) the birth of Vivasvan(Sun-God) was earlier. How am I to understand this that You instructed (him) in the beginning?"
    },
    {
      "index": 167,
      "text": "4:5  The Blessed Lord said: O Arjuna, many lives of Mine have passed, and so have yours. I know them all, (but) you know not, O scorcher of enemies!"
    },
    {
      "index": 168,
      "text": "4:6  Though I am birthless, undecaying by nature, and the Lord of beings, (still) by subjugating My Prakriti, I take birth by means of My own Maya."
    },
    {
      "index": 169,
      "text": "4:7  O scion of the Bharata dynasty, whenever righteousness is on the decline, unrighteousness is in the ascendant, then I body Myself forth."
    },
    {
      "index": 170,
      "text": "4:8  For the protection of the pious, the destruction of the evil-doers, and establishing virtue, I manifest Myself in every age."
    },
    {
      "index": 171,
      "text": "4:9  He who thus knows truly the divine birth and actions of Mine does not get re-birth after casting off the body. He attains Me, O Arjuna."
    },
    {
      "index": 172,
      "text": "4:10  Many who were devoid of attachment, fear and anger, who were absorbed in Me, who had taken refuge in Me, and were purified by the austerity of Knowledge, have attained My state."
    },
    {
      "index": 173,
      "text": "4:11  According to the manner in which they approach Me, I favour them in that very manner. O son of Partha, human beings follow My path in every way."
    },
    {
      "index": 174,
      "text": "4:12  Longing for the fruition of actions (of their rites and duties), they worship the gods here. For, in the human world, success from action comes quickly."
    },
    {
      "index": 175,
      "text": "4:13  The four castes have been created by Me through a classification of the gunas and duties. Even though I am the agent of that (act of classification), still know Me to be a non-agent and changeless."
    },
    {
      "index": 176,
      "text": "4:14  Actions do not taint Me; for Me there is no hankering for the results of actions. One who knows Me thus, does not become bound by actions."
    },
    {
      "index": 177,
      "text": "4:15  Having known thus, duties were performed even by the ancient seekers of Liberation. Therefore, you undertake action itself as was performed earlier by the ancient ones."
    },
    {
      "index": 178,
      "text": "4:16  Even the intelligent are confounded as to what is action and what is inaction. I shall tell you of that action by knowing which you will become free from evil."
    },
    {
      "index": 179,
      "text": "4:17  For there is something to be known even about action, and something to be known about prohibited action; and something has to be known about inaction. The true nature of action is inscrutable."
    },
    {
      "index": 180,
      "text": "4:18  He who finds inaction in action, and action in inaction, he is the wise one [Possessed of the knowledge of Brahman] among men; he is engaged in yoga and is a performer of all actions!"
    },
    {
      "index": 181,
      "text": "4:19  The wise call him learned whose actions are all devoid of desires and their thoughts, and whose actions have been burnt away by the fire of wisdom."
    },
    {
      "index": 182,
      "text": "4:20  Having given up attachment to the results of action, he who is ever-contented, dependent on nothing, he really does not do anything even though engaged in action."
    },
    {
      "index": 183,
      "text": "4:21  One who is without solicitation, who has the mind and organs under control, (and) is totally without possessions, he incurs no sin by performing actions merely for the (maintenance of the) body."
    },
    {
      "index": 184,
      "text": "4:22  Remaining satisfied with what comes unasked for, having transcended the dualities, being free from spite, and equipoised under success and failure, he is not bound even by performing actions."
    },
    {
      "index": 185,
      "text": "4:23  Of the liberated person who has got rid of attachment, whose mind is fixed in Knowledge, actions undertaken for a sacrifice get totally destroyed."
    },
    {
      "index": 186,
      "text": "4:24  The ladle is Brahman, the oblations is Brahman, the offering is poured by Brahman in the fire of Brahman. Brahman alone is to be reached by him who has concentration on Brahman as the objective [As an object to be known and attained. (Some translate brahma-karma-samadhina as, 'by him who sees Brahman in action'.)"
    },
    {
      "index": 187,
      "text": "4:25  Other yogis undertake sacrifice to gods alone, Others offer the Self, as a sacrifice by the Self itself, in the fire of Brahman."
    },
    {
      "index": 188,
      "text": "4:26  Others offer the organs, viz ear etc., in the fires of self-control. Others offer the objects, viz sound etc., in the fires of the organs."
    },
    {
      "index": 189,
      "text": "4:27  Others offer all the activities of the organs and the activities of the vital force into the fire of the yoga of self-control which has been lighted by Knowledge."
    },
    {
      "index": 190,
      "text": "4:28  Similarly, others are performers of sacrifices through wealth, through austerity, through yoga, and through study and knowledge; others are ascetics with severe vows."
    },
    {
      "index": 191,
      "text": "4:29  Constantly practising control of the vital forces by stopping the movements of the outgoing and the incoming breaths, some offer as a sacrifice the outgoing breath in the incoming breath; while still others, the incoming breath in the outgoing breath. Others, having their food regulated, offer the vital forces in the vital forces. All of them are knowers of the sacrifice and have their sins destroyed by sacrifice."
    },
    {
      "index": 192,
      "text": "4:30  Constantly practising control of the vital forces by stopping the movements of the outgoing and the incoming breaths, some offer as a sacrifice the outgoing breath in the incoming breath; while still others, the incoming breath in the outgoing breath. Others, having their food regulated, offer the vital forces in the vital forces. All of them are knowers of the sacrifice and have their sins destroyed by sacrifice."
    },
    {
      "index": 193,
      "text": "4:31  Those who partake of the nectar left over after a sacrifice, reach the eternal Brahman. This world ceases to exist for one who does not perform sacrifices. What to speak of the other (world), O best among the Kurus (Arjuna)!"
    },
    {
      "index": 194,
      "text": "4:32  Thus, various kinds of sacrifices lie spread at the mouth of the Vedas. Know them all to be born of action. Knowing thus, you will become liberated."
    },
    {
      "index": 195,
      "text": "4:33  O destroyer of enemies, Knowledge considered as a sacrifice is greater than sacrifices requiring materials. O son of Prtha, all actions in their totality culminate in Knowledge."
    },
    {
      "index": 196,
      "text": "4:34  Know that through prostration, inquiry and service. The wise ones who have realized the Truth will impart the Knowledge to you."
    },
    {
      "index": 197,
      "text": "4:35  Knowing which, O Pandava (Arjuna), you will not come under delusion again in this way, and through which you will see all beings without exception in the Self and also in Me."
    },
    {
      "index": 198,
      "text": "4:36  Even if you be the worst sinner among all sinners, still you will cross over all the wickedness with the raft of Knowledge alone."
    },
    {
      "index": 199,
      "text": "4:37  O Arjuna, as a blazing fire reduces pieces of wood to ashes, similarly the fire of Knowledge reduces all actions to ashes."
    },
    {
      "index": 200,
      "text": "4:38  Indeed, there is nothing purifying here comparable to Knowledge. One who has become perfected after a (long) time through yoga, realizes That by himself in his own heart."
    },
    {
      "index": 201,
      "text": "4:39  The man who has faith, is diligent and has control over the organs, attains Knowledge. Achieving Knowledge, one soon attains supreme Peace."
    },
    {
      "index": 202,
      "text": "4:40  One who is ignorant and faithless, and has a doubting mind perishes. Neither this world nor the next nor happiness exists for one who has a doubting mind."
    },
    {
      "index": 203,
      "text": "4:41  O Dhananjaya (Arjuna), actions do not bind one who has renounced actions through yoga, whose doubt has been fully dispelled by Knowledge, and who is not inadvertent."
    },
    {
      "index": 204,
      "text": "4:42  Therefore, O scion of the Bharata dyasty, take recourse to yoga and rise up, cutting asunder with the sword of Knowledge this doubt of your own in the heart, arising from ignorance."
    },
    {
      "index": 205,
      "text": "5:1  Arjuna said: O Krsna, You praise renunciation of actions, and again, (Karma-) yoga. Tell me for certain that one which is better between these two."
    },
    {
      "index": 206,
      "text": "5:2  The Blessed Lord said: Both renunciation of actions and Karma-yoga lead to Liberation. Between the two, Karma-yoga, however, excels over renunciation of actions."
    },
    {
      "index": 207,
      "text": "5:3  He who does not hate and does not crave should be known as a man of constant renunciation."
    },
    {
      "index": 208,
      "text": "5:4  The fools, not the learned ones, speak of Sankhya (the path of Knowledge) and (Karma-) yoga as different. Anyone who properly resorts to even one (of them) gets the result of both."
    },
    {
      "index": 209,
      "text": "5:5  The State [Sthana (State) is used in the derivative sense of 'the place in which one remains established, and from which one does not become relegated'.] that is reached by the Sankhyas, that is reached by the yogis as well. He sees who sees Sankhya and yoga as one."
    },
    {
      "index": 210,
      "text": "5:6  But, O mighty-armed one, renunciation is hard to attain without (Karma-) yoga. The meditative man equipped with yoga attains Brahman without delay."
    },
    {
      "index": 211,
      "text": "5:7  Endowed with yoga, [i.e. devoted to the performance of the nitya and naimittika duties.] pure in mind, controlled in body, a conqueror of the organs, the Self of the selves of all beings-he does not become tainted even while performing actions. [The construction of the sentence is this: When this person resorts to nitya and naimittika rites and duties as a means to the achievement of fully Illumination, and thus becomes fully enlightened, then, even when he acts through the apparent functions of the mind, organs, etc., he does not become affected.]"
    },
    {
      "index": 212,
      "text": "5:8  Remaining absorbed in the Self, the knower of Reality should think, 'I certainly do not do anything', even while seeing, hearing, touching, smelling, eating, moving, sleeping, breathing, speaking, releasing, holding, opening and closing the eyes-remembering that the organs function in relation to the objects of the organs."
    },
    {
      "index": 213,
      "text": "5:9  Remaining absorbed in the Self, the knower of Reality should think, 'I certainly do not do anything', even while seeing, hearing, touching, smelling, eating, moving, sleeping, breathing, speaking, releasing, holding, opening and closing the eyes-remembering that the organs function in relation to the objects of the organs."
    },
    {
      "index": 214,
      "text": "5:10  One who acts by dedicating actions to Brahman and by renouncing attachment, he does not become polluted by sin, just as a lotus leaf is not by water."
    },
    {
      "index": 215,
      "text": "5:11  By giving up attachment, the yogis undertake work merely through the body, mind, intellect and even the organs, for the purification of themselves."
    },
    {
      "index": 216,
      "text": "5:12  Giving up the result of work by becoming resolute in faith, one attains Peace arising from steadfastness. One who is lacking in resolute faith, being attached to the result under the impulsion of desire, becomes bound."
    },
    {
      "index": 217,
      "text": "5:13  The embodied man of self-control, having given up all actions mentally, continues happily in the town of nine gates, without doing or causing (others) to do anything at all."
    },
    {
      "index": 218,
      "text": "5:14  The Self does not create agentship or any objects (of desire) for anyone; nor association with the results of actions. But it is Nature that acts."
    },
    {
      "index": 219,
      "text": "5:15  The Omnipresent neither accepts anybody's sin nor even virtue. Knowledge remains covered by ignorance. Hence, the creatures become deluded."
    },
    {
      "index": 220,
      "text": "5:16  But in the case of those of whom that ignorance of theirs becomes destroyed by the knowledge (of the Self), their Knowledge, like the sun, reveals that supreme Reality."
    },
    {
      "index": 221,
      "text": "5:17  Those who have their intellect absorbed in That, whose Self is That, who are steadfast in That, who have That as their supreme Goal-they attain the state of non-returning, their dirt having been removed by Knowledge."
    },
    {
      "index": 222,
      "text": "5:18  The learned ones look with equanimity on a Brahmana endowed with learning and humility, a cow, an elephant and even a dog as well as an eater of dog's meat."
    },
    {
      "index": 223,
      "text": "5:19  Even in this world they conquer their earth-life whose minds, fixed on the Supreme, remain always balanced; for the Supreme has neither blemish nor bias."
    },
    {
      "index": 224,
      "text": "5:20  A knower of Brahman, who is established in Brahman, should have his intellect steady and should not be deluded. He should not get delighted by getting what is desirable, nor become dejected by getting what is undesirable."
    },
    {
      "index": 225,
      "text": "5:21  With his heart unattached to external objects, he gets the bliss that is in the Self. With his heart absorbed in meditation on Brahman, he acquires undecaying Bliss."
    },
    {
      "index": 226,
      "text": "5:22  Since enjoyments that result from contact (with objects) are verily the sources of sorrow and have a beginning and an end, (therefore) O son of Kunti, the wise one does not delight in them."
    },
    {
      "index": 227,
      "text": "5:23  One who can withstand here itself-before departing from the body-the impulse arising from desire and anger, that man is a yogi; he is happy."
    },
    {
      "index": 228,
      "text": "5:24  One who is happy within, whose pleasure is within, and who has his light only within, that yogi, having become Brahman, attains absorption in Brahman."
    },
    {
      "index": 229,
      "text": "5:25  The seers whose sins have been attenuated, who are freed from doubt, whose organs are under control, who are engaged in doing good to all beings, attain absorption in Brahman."
    },
    {
      "index": 230,
      "text": "5:26  To the monks who have control over their internal organ, who are free from desire and anger, who have known the Self, there is absorption in Brahman either way."
    },
    {
      "index": 231,
      "text": "5:27  Keeping the external objects outside, the eyes at the juncture of the eye-brows, and making equal the outgoing and incoming breaths that move through the nostrils, the contemplative who has control over his organs, mind and intellect should be fully intent on Liberation and free from desire, fear and anger. He who is ever is verily free."
    },
    {
      "index": 232,
      "text": "5:28  Keeping the external objects outside, the eyes at the juncture of the eye-brows, and making equal the outgoing and incoming breaths that move through the nostrils, the contemplative who has control over his organs, mind and intellect should be fully intent on Liberation and free from desire, fear and anger. He who is ever is verily free."
    },
    {
      "index": 233,
      "text": "5:29  One attains Peace by knowing Me who, as the great Lord of all the worlds, am the enjoyer of sacrifices and austerities, (and) who am the friend of all creatures."
    },
    {
      "index": 234,
      "text": "6:1  The Blessed Lord said: He who performs an action which is his duty, without depending on the result of action, he is a monk and a yogi; (but) not (so in) he who does not keep a fire and is action-less."
    },
    {
      "index": 235,
      "text": "6:2  That which they call monasticism, know that to be Sannyasa Yoga, O Pandava, For, nobody who has not given up expectations can be a yogi."
    },
    {
      "index": 236,
      "text": "6:3  For the sage who wishes to ascend to (Dhyana-) yoga, action is said to be the means. For that person, when he has ascended to (Dhyana-)yoga, inaction alone is said to be the means."
    },
    {
      "index": 237,
      "text": "6:4  Verily, [Verily: This word emphasizes the fact that, since attachment to sense objects like sound etc. and to actions is an obstacle in the path of Yoga, therefore the removal of that obstruction is the means to its attainment.] when a man who has given up thought about everything does not get attached to sense-objects or actions, he is then said to be established in Yoga."
    },
    {
      "index": 238,
      "text": "6:5  One should save oneself by oneself; one should not lower oneself. For oneself is verily one's own friend; oneself is verily one's own enemy."
    },
    {
      "index": 239,
      "text": "6:6  Of him, by whom has been conquered his very self by the self, his self is the friend of his self. But, for one who has not conquered his self, his self itself acts inimically like an enemy."
    },
    {
      "index": 240,
      "text": "6:7  The supreme Self of one who has control over the aggregate of his body and organs, and who is tranquil, becomes manifest. (He should be equipoised) [These words are supplied to complete the sentence.] in the midst of cold and heat, happiness and sorrow, as also honour and dishonour."
    },
    {
      "index": 241,
      "text": "6:8  One whose mind is satisfied with knowledge and realization, who is unmoved, who has his organs under control, is said to be Self-absorbed. The yogi treats equally a lump of earth, a stone and gold."
    },
    {
      "index": 242,
      "text": "6:9  He excels who has sameness of view with regard to a benefactor, a friend, a foe, a neutral, an arbiter, the hateful, a relative, good people and even sinners."
    },
    {
      "index": 243,
      "text": "6:10  A yogi should constantly concentrate his mind by staying in a solitary place, alone, with mind and body controlled, free from expectations, (and) free from acquisition."
    },
    {
      "index": 244,
      "text": "6:11  Having firmly established in a clean place his seat, neither too high nor too low, and made of cloth, skin and kusa-grass, placed successively one below the other;"
    },
    {
      "index": 245,
      "text": "6:12  (and) sitting on that seat, he should concentrate his mind for the purification of the internal organ, making the mind one-pointed and keeping the actions of the mind and senses under control."
    },
    {
      "index": 246,
      "text": "6:13  Holding the body, head and neck erect and still, being steady, looking at the tip of his own nose-and not looking around;"
    },
    {
      "index": 247,
      "text": "6:14  He should remain seated with a placid mind, free from fear, firm in the vow of a celibate, and with the mind fixed on Me by controlling it through concentration, having Me as the supreme Goal."
    },
    {
      "index": 248,
      "text": "6:15  Concentrating the mind thus for ever, the yogi of controlled mind achieves the Peace which culminates in Liberation and which abides in Me."
    },
    {
      "index": 249,
      "text": "6:16  But, O Arjuna, Yoga is not for one who eats too much, nor for one who does not eat at all; neither for one who habitually sleeps too long, nor surely for one who keeps awake."
    },
    {
      "index": 250,
      "text": "6:17  Yoga becomes a destroyer of sorrow of one whose eating and movements are regulated, whose effort in works is moderate, and whose sleep and wakefulness are temperate."
    },
    {
      "index": 251,
      "text": "6:18  A man who has become free from hankering for all desirable objects is then said to be Self-absorbed when the controlled mind rests in the Self alone."
    },
    {
      "index": 252,
      "text": "6:19  As a lamp kept in a windless place does not flicker, such is the simile thought of for the yogi whose mind is under control, and who is engaged in concentration on the Self."
    },
    {
      "index": 253,
      "text": "6:20  At the time when the mind restrained through the practice of Yoga gets withdrawn, and just when by seeing the Self by the self-one remains contented in the Self alone;"
    },
    {
      "index": 254,
      "text": "6:21  When one experiences that absolute Bliss which can be intuited by the intellect and which is beyond the senses, and being established (thus) this person surely does not swerve from Reality;"
    },
    {
      "index": 255,
      "text": "6:22  Obtaining which one does not think of any other acquisition to be superior to that, and being established in which one is not perturbed even by great sorrow;"
    },
    {
      "index": 256,
      "text": "6:23  One should know that severance of contact with sorrow to be what is called Yoga. That Yoga has to be practised with perseverance and with an undepressed heart."
    },
    {
      "index": 257,
      "text": "6:24  By totally eschewing all desires which arise from thoughts, and restraining with the mind itself all the organs from every side;"
    },
    {
      "index": 258,
      "text": "6:25  One should gradually withdraw with the intellect endowed with steadiness. Making the mind fixed in the Self, one should not think of anything whatsoever."
    },
    {
      "index": 259,
      "text": "6:26  (The yogi) should bring (this mind) under the subjugation of the Self Itself, by restraining it from all those causes whatever due to which the restless, unsteady mind wanders away."
    },
    {
      "index": 260,
      "text": "6:27  Supreme Bliss comes to this yogi alone whose mind has become perfectly tranquil, whose (quality of) rajas has been eliminated, who has become identified with Brahman, and is taintless."
    },
    {
      "index": 261,
      "text": "6:28  By concentrating his mind constantly thus, the taintless yogi easily attains the absolute Bliss of contact with Brahman."
    },
    {
      "index": 262,
      "text": "6:29  One who has his mind Self-absorbed through Yoga, and who has the vision of sameness every-where, see this Self existing in everything, and every-thing in his Self."
    },
    {
      "index": 263,
      "text": "6:30  One who sees Me in everything, and sees all things in Me, he is never out of My sight, nor am I ever out of his sight."
    },
    {
      "index": 264,
      "text": "6:31  That yogi who, being established in unity, adores Me as existing in all things, he exists in Me-in whatever condition he may be."
    },
    {
      "index": 265,
      "text": "6:32  O Arjuna, that yogi is considered the best who judges what is happiness and sorrow in all beings by the same standard as he would apply to himself."
    },
    {
      "index": 266,
      "text": "6:33  Arjuna said: O Madhusudana (Krsna), this Yoga that has been spoken of by You as sameness, I do not see its steady continuance, owing to the restlessness (of the mind)."
    },
    {
      "index": 267,
      "text": "6:34  For, O Krsna, the mind is unsteady, turbulent, strong and obstinate. I consider its control to be as greatly difficult as of the wind."
    },
    {
      "index": 268,
      "text": "6:35  The Blessed Lord said: O mighty-armed one, undoubtedly the mind is intractable and restless. But, O son of Kunti, it is brought under control through practice and detachment."
    },
    {
      "index": 269,
      "text": "6:36  My conviction is that Yoga is difficult to be attained by one of uncontrolled mind. But it is possible to be attained through the (above) means by one who strives and has a controlled mind."
    },
    {
      "index": 270,
      "text": "6:37  Arjuna said: O Krsna, failing to achieve perfection in Yoga, what goal does one attain, who, though possessed of faith, is not diligent and whose mind becomes deflected from Yoga?"
    },
    {
      "index": 271,
      "text": "6:38  O Mighty-armed one, fallen from both, without support, deluded on the path to Brahman, does he not get ruined like a scattered cloud?"
    },
    {
      "index": 272,
      "text": "6:39  O Krsna, You should totally eradicate this doubt of mine. For, none other than Yourself can be the dispeller of this doubt!"
    },
    {
      "index": 273,
      "text": "6:40  The Blessed Lord said: O Partha, there is certainly no ruin for him here or hereafter. For, no one engaged in good meets with a deplorable end, My son!"
    },
    {
      "index": 274,
      "text": "6:41  Attaining the worlds of the righteous, and residing there for eternal years, the man fallen from Yoga is born in the house of the pious and the prosperous."
    },
    {
      "index": 275,
      "text": "6:42  Or he is born in the family of wise yogis only. Such a birth as is of this kind is surely more difficult to get in the world."
    },
    {
      "index": 276,
      "text": "6:43  There he becomes endowed with that wisdom acquired in the previous body. and he strives more than before for perfection, O scion of the Kuru dynasty."
    },
    {
      "index": 277,
      "text": "6:44  For, by that very past practice, he is carried forward even in spite of himself! Even a seeker of Yoga transcends the result of the performance of Vedic rituals!"
    },
    {
      "index": 278,
      "text": "6:45  However, the yogi, applying himself assiduously, becoming purified from sin and attaining perfection through many births, thereby achieves the highest Goal."
    },
    {
      "index": 279,
      "text": "6:46  A yogi is higher than men of austerity; he is considered higher even than men of knowledge. The yogi is also higher than men of action. Therefore, O Arjuna, you become a yogi."
    },
    {
      "index": 280,
      "text": "6:47  Even among all the yogis, he who adores Me with his mind fixed on Me and with faith, he is considered by Me to be the best of the yogis."
    },
    {
      "index": 281,
      "text": "7:1  The Blessed Lord said: O Partha, hear how you, having the mind fixed on Me, practising the Yoga of Meditation and taking refuge in Me, will know Me with certainty and in fullness."
    },
    {
      "index": 282,
      "text": "7:2  I shall tell you in detail of this Knowledge which is combined with realization, after experiencing which there remains nothing else here to be known again."
    },
    {
      "index": 283,
      "text": "7:3  Among thousands of men a rare one endeavours for perfection. Even of the perfected ones who are diligent, one perchance knows Me in truth."
    },
    {
      "index": 284,
      "text": "7:4  This Prakrti of Mine is divided eight-fold thus: earth, water, fire, air, space, mind, intellect and also egoism."
    },
    {
      "index": 285,
      "text": "7:5  O mighty-armed one, this is the inferior (Prakrti). Know the other Prakrti of Mine which, however, is higher than this, which has taken the form of individual souls, and by which this world is upheld."
    },
    {
      "index": 286,
      "text": "7:6  Understand thus that all things (sentient and insentient) have these as their source. I am the origin as also the end of the whole Universe."
    },
    {
      "index": 287,
      "text": "7:7  O Dhananjaya, there is nothing else whatsoever higher than Myself. All this is strung on Me like pearls on a string."
    },
    {
      "index": 288,
      "text": "7:8  O son of Kunti, I am the taste of water, I am the effulgence of the moon and the sun; (the letter) Om in all the Vedas, the sound in space, and manhood in men."
    },
    {
      "index": 289,
      "text": "7:9  I am also the sweet fragrance in the earth; I am the brilliance in the fire, and the life in all beings; and I am the austerity of the ascetics."
    },
    {
      "index": 290,
      "text": "7:10  O Partha, know Me to be the eternal Seed of all beings. I am the intellect of the intelligent, I am the courage of the courageous."
    },
    {
      "index": 291,
      "text": "7:11  And of the strong I am the strength which is devoid of passion and attachment. Among creatures I am desire which is not contrary to righteousness, O scion of the Bharata dynasty."
    },
    {
      "index": 292,
      "text": "7:12  Those things that indeed are made of (the quality of) sattva, and those things that are made of (the quality of) rajas and tamas, know them to have sprung from Me alone. However, I am not in them; they are in Me!"
    },
    {
      "index": 293,
      "text": "7:13  All this world, deluded as it is by these three things made of the gunas (qualities), does not know Me who am transcendental to these and undecaying."
    },
    {
      "index": 294,
      "text": "7:14  Since this divine Maya of Mine which is constituted by the gunas is difficult to cross over, (therefore) those who take refuge in Me alone cross over this Maya."
    },
    {
      "index": 295,
      "text": "7:15  The foolish evildoers, who are the most depraved among men, who are deprived of (their) wisdom by Maya, and who resort to demoniacal ways, do not take refuge in Me."
    },
    {
      "index": 296,
      "text": "7:16  O Arjuna, foremost of the Bharata dynasty, four classes of people of virtuous deeds adore Me: the afflicted, the seeker of Knowledge, the seeker of wealth and the man of Knowledge."
    },
    {
      "index": 297,
      "text": "7:17  Of them, the man of Knowledge, endowed with constant steadfastness and one-pointed devotion, excels. For I am very much dear to the man of Knowledge, and he too is dear to Me."
    },
    {
      "index": 298,
      "text": "7:18  All of these, indeed, are noble, but the man of Knowledge is the very Self. (This is) My opinion. For, with a steadfast mind, he is set on the path leading to Me alone who am the super-excellent Goal."
    },
    {
      "index": 299,
      "text": "7:19  At the end of many births the man of Knowledge attains Me, (realizing) that Vasudeva is all. Such a high-souled one is very rare."
    },
    {
      "index": 300,
      "text": "7:20  People, deprived of their wisdom by desires for various objects and guided by their own nature, resort to other deities following the relevant methods."
    },
    {
      "index": 301,
      "text": "7:21  Whichever form (of a deity) any devotee wants to worship with faith, that very firm faith of his I strengthen."
    },
    {
      "index": 302,
      "text": "7:22  Being imbued with that faith, that person engages in worshipping that form, and he gets those very desired results therefrom as they are dispensed by Me alone."
    },
    {
      "index": 303,
      "text": "7:23  That result of theirs who are of poor intellect is indeed limited. The worshippers of gods go to the gods. My devotees go to Me alone."
    },
    {
      "index": 304,
      "text": "7:24  The unintelligent, unaware of My supreme state which is immutable and unsurpassable, think of Me as the unmanifest that has become manifest."
    },
    {
      "index": 305,
      "text": "7:25  Being enveloped by yoga-maya, I do not become manifest to all. This deluded world does not know Me who am birthless and undecaying."
    },
    {
      "index": 306,
      "text": "7:26  O Arjuna, I know the past and the present as also the future beings; but no one knows Me!"
    },
    {
      "index": 307,
      "text": "7:27  O scion of the Bharata dynasty, O destroyer of foes, due to the delusion of duality arising from likes and dislikes, all creatures become bewildered at the time of their birth."
    },
    {
      "index": 308,
      "text": "7:28  On the other hand, those persons who are of virtuous deeds, whose sin has come to an end, they, being free from the delusion of duality and firm in their convictions, adore Me."
    },
    {
      "index": 309,
      "text": "7:29  Those who strive by resorting to Me for becoming free from old age and death, they know that Brahman, everything about the individual Self, and all about actions. [They know Brahman as being all the individual entities and all actions. This verse prescribes meditation on the qualified Brahman for aspirants of the middle class. Verses beginning with the 14th speak about the realization of the unqualified Brahman by aspirants of the highest class.]"
    },
    {
      "index": 310,
      "text": "7:30  Those who know me as existing in the physical and the divine planes, and also in the context of the sacrifice, they of concentrated minds know Me even at the time of death."
    },
    {
      "index": 311,
      "text": "8:1  Arjuna said: O supreme person, what is that Brahman? What is that which exists in the individual plane? What is action? And what is that which is said to exist in the physical plane? What is that which is said to be existing in the divine plane?"
    },
    {
      "index": 312,
      "text": "8:2  O Madhusudana, how, and who, is the entity existing in the sacrifice here in this body? And at the time of death, how are You to be known by people of concentrated minds?"
    },
    {
      "index": 313,
      "text": "8:3  The Blessed Lord said: The Immutable is the supreme Brahman; self-hood is said to be the entity present in the individual plane. By action is meant the offerings which bring about the origin of the existence of things."
    },
    {
      "index": 314,
      "text": "8:4  That which exists in the physical plane is the mutable entity, and what exists in the divine plane is the Person. O best among the embodied beings, I Myself am the entity that exists in the sacrifice in this body."
    },
    {
      "index": 315,
      "text": "8:5  And at the time of death, anyone who departs by giving up the body while thinking of Me alone, he attains My state. There is no doubt about this."
    },
    {
      "index": 316,
      "text": "8:6  O son of Kunti, thinking of any entity whichever it may be one gives up the body at the end, he attains that very one, having been always engrossed in its thought."
    },
    {
      "index": 317,
      "text": "8:7  Therefore, think of Me at all times and fight. There is no doubt that by dedicating your mind and intellect to Me, you will attain Me alone."
    },
    {
      "index": 318,
      "text": "8:8  O son of Prtha, by meditating with a mind which is engaged in the yoga of practice and which does not stray away to anything else, one reaches the supreme Person existing in the effulgent region."
    },
    {
      "index": 319,
      "text": "8:9  He who meditates on the Omniscient, the Ancient, the Ruler, subtler than the subtle, the Ordainer of everything, of inconceivable form, effulgent like the sun, and beyond darkness- (he attains the supreme Person)."
    },
    {
      "index": 320,
      "text": "8:10  At the time of death, having fully fixed the Prana (vita force) between the eyebrows with an unswerving mind, and being imbued with devotion as also the strength of concentration, he reaches that resplendent supreme person."
    },
    {
      "index": 321,
      "text": "8:11  I shall speak to you briefly of that immutable Goal which the knowers of the Vedas declare, into which enter the diligent ones free from attachment, and aspiring for which people practise celibacy."
    },
    {
      "index": 322,
      "text": "8:12  Having controlled all the passages, having confined the mind in the heart, and having fixed his own vital force in the head, (and then) continuing in the firmness in yoga;"
    },
    {
      "index": 323,
      "text": "8:13  He who departs by leaving the body while uttering the single syllable, viz Om, which is Brahman, and thinking of Me, he attains the supreme Goal."
    },
    {
      "index": 324,
      "text": "8:14  O son of Prtha, to that yogi of constant concentration and single-minded attention, who remembers Me uninterruptedly and for long, I am easy of attainment."
    },
    {
      "index": 325,
      "text": "8:15  As a result of reaching Me, the exalted ones who have attained the highest perfection do not get rebirth which is an abode of sorrows and which is impermanent."
    },
    {
      "index": 326,
      "text": "8:16  O Arjuna, all the worlds together with the world of Brahma are subject to return. But, O son of Kunti, there is no rebirth after reaching Me."
    },
    {
      "index": 327,
      "text": "8:17  Those people who are knowers of what day and night are, know the day of Brahma which ends in a thousand yugas [The four yugas (in the human worlds), viz Satya, Treta, Dwapara, and Kali are made up of 4,320,000 years. This period multiplied by a thousand constitutes one day of Brahma. His night also extends over an equal period.], and His night which ends in a thousand yugas."
    },
    {
      "index": 328,
      "text": "8:18  With the coming of day all manifested things emerge from the Unmanifest and when night comes they merge in that itself which is called the Unmanifested."
    },
    {
      "index": 329,
      "text": "8:19  O son of Prtha, after being born again and again, that very multitude of beings disappears in spite of itself at the approach of night. It comes to life at the approach of day."
    },
    {
      "index": 330,
      "text": "8:20  But distinct from that Unmanifested is the other eternal unmainfest Reality, who does not get destroyed when all beings get destroyed."
    },
    {
      "index": 331,
      "text": "8:21  He who has been mentioned as the Unmanifested, the Immutable, they call Him the supreme Goal. That is the supreme abode of Mine, reaching which they do not return."
    },
    {
      "index": 332,
      "text": "8:22  O son of Prtha, that supreme Person-in whom are included (all) the beings and by whom all this is pervaded-is, indeed, reached through one-pointed devotion."
    },
    {
      "index": 333,
      "text": "8:23  O best of the Bharata dynasty, I shall now speak of that time by departing at which the yogis attain the State of Non-return, and also (of the time by departing at which they attain) the State of Return."
    },
    {
      "index": 334,
      "text": "8:24  Fire, light, daytime, the bright fortnight, the six months of the Northern solstice-by following this Path, persons who are knowers of Brahman attain Brahman when they die."
    },
    {
      "index": 335,
      "text": "8:25  Smoke, night, as also the dark fortnight and the six months of the Southern solstice-following this Path the yogi having reached the lunar light, returns."
    },
    {
      "index": 336,
      "text": "8:26  These two courses of the world, which are white and black, are verily considered eternal. By the one a man goes to the State of Non-return; by the other he returns again."
    },
    {
      "index": 337,
      "text": "8:27  O son of Prtha, no yogi [One steadfast in meditation.) whosoever has known these two courses becomes deluded. Therefore, O Arjuna, be you steadfast in yoga at all times."
    },
    {
      "index": 338,
      "text": "8:28  Having known this, the yogi transcends all those results of righteous deeds that are declared with regard to the Vedas, sacrifices, austerities and also charities, and he reaches the primordial supreme State."
    },
    {
      "index": 339,
      "text": "9:1  The Blessed Lord said: However, to you who are not given to cavilling I shall speak of this highest secret itself, which is Knowledge [Jnana may mean Brahman that is Consciousness, or Its knowledge gathered from the Vedas (paroksa-jnana). Vijnana is direct experience (aparoksa-jnana).] combined with experience, by realizing which you shall be free from evil."
    },
    {
      "index": 340,
      "text": "9:2  This is the Sovereign Knowledge, the Sovereign Profundity, the best sanctifier; directly realizable, righteous, very easy to practise and imperishable."
    },
    {
      "index": 341,
      "text": "9:3  O destroyer of foes, persons who are regardless of this Dharma (knowledge of the Self) certainly go round and round, without reaching Me, along the path of transmigration which is fraught with death."
    },
    {
      "index": 342,
      "text": "9:4  This whole world is pervaded by Me in My unmanifest form. All beings exist in Me, but I am not contained in them!"
    },
    {
      "index": 343,
      "text": "9:5  Nor do the beings dwell in Me. Behold My Divine Yoga! I am the sustainer and originator of beings, but My Self is not contained in the beings."
    },
    {
      "index": 344,
      "text": "9:6  Understand thus that just as the voluminous wind moving everywhere is ever present in space, similarly all beings abide in Me."
    },
    {
      "index": 345,
      "text": "9:7  O son of Kunti, all the beings go back at the end of a cycle to My Prakrti. I project them forth again at the beginning of a cycle."
    },
    {
      "index": 346,
      "text": "9:8  Keeping My own Prakrti under control, I project forth again and again the whole of this multitude of beings which are powerless owing to the influence of (their own) nature."
    },
    {
      "index": 347,
      "text": "9:9  O Dhananjaya (Arjuna), nor do those actions bind Me, remaining (as I do) like one unconcerned with, and unattached to, those actions."
    },
    {
      "index": 348,
      "text": "9:10  Under Me as the supervisor, the Prakrti produces (the world) of the moving and the non-moving things. Owing to this reason, O son of Kunti, the world revolves."
    },
    {
      "index": 349,
      "text": "9:11  Not knowing My supreme nature as the Lord of all beings, foolish people disregard Me who have taken a human body."
    },
    {
      "index": 350,
      "text": "9:12  Of vain hopes, of vain actions, of vain knowledge, and senseless, they become verily possessed of the deceptive disposition of fiends and demons."
    },
    {
      "index": 351,
      "text": "9:13  O son of Prtha, the noble ones, being possessed of divine nature, surely adore Me with single-mindedness, knowing Me as the immutable source of all objects."
    },
    {
      "index": 352,
      "text": "9:14  Always glorifying Me and striving, the men of firm vows worship Me by paying obeisance to Me and being ever endowed with devotion."
    },
    {
      "index": 353,
      "text": "9:15  Others verily worship Me by adoring exclusively through the sacrifice of the knowledge of oneness; (others worship Me) multifariously, and (others) as the multiform existing variously."
    },
    {
      "index": 354,
      "text": "9:16  I am the kratu, I am the yajna, I am the svadha, I am the ausadha, I am the mantra, I Myself am the ajay, I am the fire, and I am the act of offering."
    },
    {
      "index": 355,
      "text": "9:17  Of this world I am the father, mother, ordainer, (and the), grand-father; I am the knowable, the sanctifier, the syllable Om as also Rk, Sama and Yajus."
    },
    {
      "index": 356,
      "text": "9:18  (I am) the fruit of actions, the nourisher, the Lord, witness, abode, refuge, friend, origin, end, foundation, store and the imperishable seed."
    },
    {
      "index": 357,
      "text": "9:19  O Arjuna, I give heat, I withhold and pour down rain. I am verily the nectar, and also death existence and nonexistence."
    },
    {
      "index": 358,
      "text": "9:20  Those who are versed in the Vedas, who are drinkers of Soma and are purified of sin, pray for the heavenly goal by worshipping Me through sacrifices. Having reached the place (world) of the king of gods, which is the result of righteousness, they enjoy in heaven th divine pleasure of gods."
    },
    {
      "index": 359,
      "text": "9:21  After having enjoyed that vast heavenly world, they enter into the human world on the exhaustion of their merit. Thus, those who follow the rites and duties prescribed in the three Vedas, and are desirous of pleasures, attain the state of going and returning."
    },
    {
      "index": 360,
      "text": "9:22  Those persons who, becoming non-different from Me and meditative, worship Me everywhere, for them, who are ever attached (to Me), I arrange for securing what they lack and preserving what they have."
    },
    {
      "index": 361,
      "text": "9:23  Even those who, being devoted to other deities and endowed with faith, worship (them), they also, O son of Kunti, worship Me alone (though) following the wrong method."
    },
    {
      "index": 362,
      "text": "9:24  I indeed am the enjoyer as also the Lord of all sacrifices; but they do not know Me in reality. Therefore, they fall."
    },
    {
      "index": 363,
      "text": "9:25  Votaries of the gods reach the gods; the votaries of the manes go to the manes; the worshippers of the Beings reach the Beings; and those who worship Me reach Me."
    },
    {
      "index": 364,
      "text": "9:26  Whoever offers Me with devotion-a leaf, a flower, a fruit, or water, I accept that (gift) of the pure-hearted man which has been devotionally presented."
    },
    {
      "index": 365,
      "text": "9:27  O son of Kunti, whatever you do, whatever you eat, whatever you offer as a sacrifice, whatever you give and whatever austerities you undertake, (all) that you offer to Me."
    },
    {
      "index": 366,
      "text": "9:28  Thus, you will become free from bondage in the form of actions which are productive of good and bad results. Having your mind imbued with the yoga of renunciation and becoming free, you will attain Me."
    },
    {
      "index": 367,
      "text": "9:29  I am impartial towards all beings; to Me there is none detestable or none dear. But those who worship Me with devotion, they exist in Me, and I too exist in them."
    },
    {
      "index": 368,
      "text": "9:30  Even if a man of very bad conduct worships Me with one-pointed devotion, he is to be considered verily good; for he has resolved rightly."
    },
    {
      "index": 369,
      "text": "9:31  He soon becomes possessed of a virtuous mind; he attains everlasting peace. Do you proclaim boldly, O son of Kunti, that My devotee does not get ruined."
    },
    {
      "index": 370,
      "text": "9:32  For, O son of Prtha, even those who are born of sin-women, Vaisyas, as also Sudras, even they reach the highest Goal by taking shelter under Me."
    },
    {
      "index": 371,
      "text": "9:33  What to speak of the holy Brahmanas as also of devout kind-sages! Having come to this ephemeral and miserable world, do you worship Me."
    },
    {
      "index": 372,
      "text": "9:34  Having your mind fixed on Me, be devoted to Me, sacrifice to Me, and bow down to Me. By concentrating your mind and accepting Me as the supreme Goal, you shall surely attain Me who am thus the Self."
    },
    {
      "index": 373,
      "text": "10:1  The Blessed Lord said: O mighty-armed one, listen over again ot My supreme utterance, which I, wishing your welfare, shall speak to you who take delight (in it)."
    },
    {
      "index": 374,
      "text": "10:2  Neither the gods nor the great sages know My majesty. For, in all respects, I am the source of the gods and the great sages."
    },
    {
      "index": 375,
      "text": "10:3  He who knows Me-the birth-less, the beginning-less, and the great Lord of the worlds, he, the undeluded one among mortals, becomes freed from all sins."
    },
    {
      "index": 376,
      "text": "10:4  Intelligence, wisdom, non-delusion, forgiveness, truth, control of the external organs, control of the internal organs, happiness, sorrow, birth, death and fear as also fearlessness, non-injury, equanimity, satisfaction, austerity, charity, fame, infamy-(these) different dispositions of beings spring from Me alone."
    },
    {
      "index": 377,
      "text": "10:5  Intelligence, wisdom, non-delusion, forgiveness, truth, control of the external organs, control of the internal organs, happiness, sorrow, birth, death and fear as also fearlessness, non-injury, equanimity, satisfaction, austerity, charity, fame, infamy-(these) different dispositions of beings spring from Me alone."
    },
    {
      "index": 378,
      "text": "10:6  The seven great sages as also the four Manus of ancient days, of whom are these creatures in the world, had their thoughts fixed on Me, and they were born from My mind."
    },
    {
      "index": 379,
      "text": "10:7  One who knows truly this majesty and yoga of Mine, he becomes imbued with unwavering Yoga. There is no doubt about this."
    },
    {
      "index": 380,
      "text": "10:8  I am the origin of all; everything moves on owing to Me. Realizing thus, the wise ones, filled with fervour, adore Me."
    },
    {
      "index": 381,
      "text": "10:9  With minds fixed on Me, with lives dedicated to Me, enlightening each other, and always speaking of Me, they derive satisfaction and rejoice."
    },
    {
      "index": 382,
      "text": "10:10  To them who are ever devoted and worship Me with love, I grant that possession of wisdom by which they reach Me."
    },
    {
      "index": 383,
      "text": "10:11  Out of compassion for them alone, I, residing in their hearts, destroy the darkness born of ignorance with the luminous lamp of Knowledge."
    },
    {
      "index": 384,
      "text": "10:12  Arjuna said: You are the supreme Brahman, the supreme Light, the supreme Sanctifier."
    },
    {
      "index": 385,
      "text": "10:13  All the sages as also the divine sage Narada, Asita, Devala and Vyasa [Although Narada and the other sages are already mentioned by the words 'all the sages', still they are named separately because of their eminence. Asita is the father of Devala.] call You the eternal divine Person, the Primal God, the Birth-less, the Omnipresent; and You Yourself verily tell me (so)."
    },
    {
      "index": 386,
      "text": "10:14  O Kesava, I accept to be true all this which You tell me. Certainly, O Lord, neither the gods nor the demons comprehend Your glory."
    },
    {
      "index": 387,
      "text": "10:15  O supreme Person, the Creator of beings, the Lord of beings, God of gods, the Lord of the worlds, You Yourself alone know Yourself by Yourself."
    },
    {
      "index": 388,
      "text": "10:16  Be pleased to speak in full of Your own manifestations which are indeed divine, through which manifestations You exist pervading these worlds."
    },
    {
      "index": 389,
      "text": "10:17  O Yogi, [Here yoga stands for the results of yoga, viz omniscience, omnipotence, etc.; one possessed of these is a yogi.] how shall I know You by remaining ever-engaged in meditation? And through what objects, O Lord, are You to be meditated on by me?"
    },
    {
      "index": 390,
      "text": "10:18  O Janardana, narrate to me again [In addition to what has been said in the seventh and ninth chapters.] Your own yoga and (divine) manifestations elaborately. For, while hearing (Your) nectar-like (words), there is no satiety in me."
    },
    {
      "index": 391,
      "text": "10:19  The Blessed Lord said: O best of the Kurus, now, according to their importance, I shall describe to you My own glories, which are indeed divine. There is no end to my manifestations."
    },
    {
      "index": 392,
      "text": "10:20  O Gudakesa, I am the Self residing in the hearts of all beings, and I am the beginning and the middle as also the end of (all) beings."
    },
    {
      "index": 393,
      "text": "10:21  Among the Adityas [viz Dhata, Mitra, Aryama, Rudra, Varuna, Surya, Bhaga, Vivasvan, Pusa, Savita, Tvasta and Visnu] I am Visnu; among the luminaries, the radiant sun; among the (forty-nine) Maruts [The seven groups of Maruts are Avaha, Pravaha, Vivaha, Paravaha, Udvaha, Samvaha and parivaha] I am Marici; among the stars I am the moon."
    },
    {
      "index": 394,
      "text": "10:22  Among the Vedas I am Sama-veda; among the gods I am Indra. Among the organs I am the mind, and I am the intelligence in creatures."
    },
    {
      "index": 395,
      "text": "10:23  Among the Rudras [Aja, Ekapada, Ahirbudhnya, Pinaki, Aparajita, Tryam-baka, Mahesvara, Vrsakapi, Sambhu, Harana and Isvara. Different Puranas give different lists of eleven names.] I am Sankara, and among the Yaksas and goblins I am Kubera [God of wealth. Yaksas are a class of demigods who attend on him and guard his wealth.]. Among the Vasus [Apa, Dhruva, Soma, Dharma, Anila, Anala (Fire), Pratyusa and Prabhasa.] I am Fire, and among the mountains I am Meru."
    },
    {
      "index": 396,
      "text": "10:24  O son of Prtha, know me to be Brhaspati, the foremost among the priests of kings. Among commanders of armies I am Skanda; among large expanses of water I am the sea."
    },
    {
      "index": 397,
      "text": "10:25  Among the great sages I am Bhrgu; of words, I am the single syllable (Om) [Om is the best because it is the name as well as the symbol of Brahman.]. Among rituals I am the ritual of Japa [Japa, muttering prayers-repeating passages from the Vedas, silently repeating names of deities, etc. Rituals often involve killing of animals. But Japa is free from such injury, and hence the best.] of the immovable, the Himalaya."
    },
    {
      "index": 398,
      "text": "10:26  Among all trees (I am) the Asvatha (peepul), and Narada among the divine sages. Among the gandharvas [A class of demigods regarded as the musicians of gods.] (I am) Citraratha; among the perfected ones, the sage Kapila."
    },
    {
      "index": 399,
      "text": "10:27  Among horses, know Me to be Uccaihsravas, born of nectar; Airavata among the lordly elephants; and among men, the Kind of men. [Uccaihsravas and Airavata are respectively the divine horse and elephant of Indra.]"
    },
    {
      "index": 400,
      "text": "10:28  Among weapons I am the thunderbolt; among cows I am Kamadhenu. I am Kandarpa, the Progenitor, and among serpents I am Vasuki."
    },
    {
      "index": 401,
      "text": "10:29  Among snakes I am Ananta, and Varuna among gods of the waters. Among the manes I am Aryama, and among the maintainers of law and order I am Yama (King of death)."
    },
    {
      "index": 402,
      "text": "10:30  Among demons I am Prahlada, and I am Time among reckoners of time. And among animals I am the loin, and among birds I am Garuda."
    },
    {
      "index": 403,
      "text": "10:31  Of the purifiers I am air; among the wielders of weapons I am Rama. Among fishes, too, I am the shark; I am Ganga among rivers."
    },
    {
      "index": 404,
      "text": "10:32  O Arjuna, of creations I am the beginning and the end as also the middle, I am the knowledge of the Self among knowledge; of those who date I am Vada."
    },
    {
      "index": 405,
      "text": "10:33  Of the letters I am the letter a, and of the group of compound words I am (the compound called) Dvandva. [Dvandva: A compound of two or more words which, if not compounded, would stand in the same case and be connected by the conjunction 'and'] I Myself am the infinite time; I am the Dispenser with faces everywhere."
    },
    {
      "index": 406,
      "text": "10:34  And I am Death, the destroyer of all; and the prosperity of those destined to be prosperous. Of the feminine (I am) fame, beauty, speech, memory, intelligence, fortitude and forbearance."
    },
    {
      "index": 407,
      "text": "10:35  I am also the Brhat-sama of the Sama (-mantras); of the metres, Gayatri. Of the months, I am Marga-sirsa, and of the seasons, spring."
    },
    {
      "index": 408,
      "text": "10:36  Of the fraudulent I am the gambling; I am the irresistible command of the mighty. I am excellence, I am effort, I am the sattva quality of those possessed of sattva."
    },
    {
      "index": 409,
      "text": "10:37  Of the vrsnis [The clan to which Sri Krsna belonged, known otherwise as the Yadavas.] I am Vasudeva; of the Pandavas, Dhananjaya (Arjuna). And of the wise, I am Vyasa; of the omniscient, the omniscient Usanas."
    },
    {
      "index": 410,
      "text": "10:38  Of the punishers I am the rod; I am the righteous policy of those who desire to conquer. And of things secret, I am verily silence; I am knowledge of the men of knowledge."
    },
    {
      "index": 411,
      "text": "10:39  Moreover, O Arjuna, whatsoever is the seed of all beings, that I am. There is no thing moving or non-moving which can exist without Me."
    },
    {
      "index": 412,
      "text": "10:40  O destroyer of enemies, there is no limit to My divine manifestations. This description of (My) manifestations, however, has been stated by Me by way of illustration."
    },
    {
      "index": 413,
      "text": "10:41  Whatever object [All living beings] is verily endowed with majesty, possessed of prosperity, or is energetic, you know for certain each of them as having a part of My power as its source."
    },
    {
      "index": 414,
      "text": "10:42  Or, on the other hand, what is the need of your knowing this extensively, O Arjuna? I remain sustaining this whole creation in a special way with a part (of Myself)."
    },
    {
      "index": 415,
      "text": "11:1  Arjuna said: This delusion of mine has departed as a result of that speech which is most secret and known as pertaining to the Self, and which was uttered by You for my benefit."
    },
    {
      "index": 416,
      "text": "11:2  O you with eyes like lotus leaves, the origin and dissolution of beings have been heard by me in detail from You. ['From You have been heard the origin and dissolution of beings in You.'] And (Your) undecaying glory, too, (has been heard)."
    },
    {
      "index": 417,
      "text": "11:3  O supreme Lord, so it is, as You speak about Yourself. O supreme Person, I wish to see the divine form of Yours."
    },
    {
      "index": 418,
      "text": "11:4  O Lord, if You think that it is possible to be seen by me, then, O Lord of Yoga, You show me Your eternal Self."
    },
    {
      "index": 419,
      "text": "11:5  The Blessed Lord said: O son of Prtha, behold My forms in (their) hundreds and in thousands, of different kinds, celestial, and of various colours and shapes."
    },
    {
      "index": 420,
      "text": "11:6  See the Adiyas, the Vasus, the Rudras, the two Asvins and the Maruts. O scion of the Bharata dynasty, behold also the many wonders not seen before."
    },
    {
      "index": 421,
      "text": "11:7  See now, O Gudakesa (Arjuna), the entire Universe together with the moving and the non-moving, concentrated at the same place here in My body, as also whatever else you would like to see."
    },
    {
      "index": 422,
      "text": "11:8  But you are not able to see Me merely with this eye of yours. I grant you the supernatural eye; behold My Divine Yoga."
    },
    {
      "index": 423,
      "text": "11:9  Sanjaya said: O King, having spoken thus, thereafter, Hari [Hari: destroyer of ignorance along with its consciences.] (Krsna) the great Master of Yoga, showed to the son of Prtha the supreme divine form:"
    },
    {
      "index": 424,
      "text": "11:10  Having many faces and eyes, possessing many wonderful sights, adorned with numerous celestial ornaments, holding many uplifted heavenly weapons;"
    },
    {
      "index": 425,
      "text": "11:11  Wearing heavenly garlands and apparel, anointed with heavenly scents, abounding in all kinds of wonder, resplendent, infinite, and with faces everywhere."
    },
    {
      "index": 426,
      "text": "11:12  Should the effulgence of a thousand suns blaze forth simultaneously in the sky, that might be similar to the radiance of that exalted One."
    },
    {
      "index": 427,
      "text": "11:13  At that time, Pandava saw there, in the body of the God of gods, the whole diversely differentiated Universe united in the one (Cosmic form)."
    },
    {
      "index": 428,
      "text": "11:14  Then, filled with wonder, with hairs standing on end, he, Dhananjaya, (Arjuna), bowing down with his head to the Lord, said with folded hands:"
    },
    {
      "index": 429,
      "text": "11:15  Arjuna said: O God, I see in Your body all the gods as also hosts of (various) classes of beings; Brahma the ruler, sitting on a lotus seat, and all the heavenly sages and serpents."
    },
    {
      "index": 430,
      "text": "11:16  I see You as possessed of numerous arms, bellies, mouths and eyes; as having infinite forms all around. O Lord of the Universe, O Cosmic Person, I see not Your limit nor the middle, nor again the beginning!"
    },
    {
      "index": 431,
      "text": "11:17  I see You as wearing a crown, wielding a mace, and holding a disc; a mass of brilliance glowing all around, difficult to look at from all sides, possessed of the radiance of the blazing fire and sun, and immeasurable."
    },
    {
      "index": 432,
      "text": "11:18  You are the Immutable, the supreme One to be known; You are the most perfect repository of this Universe. You are the Imperishable, the Protector of the ever-existing religion; You are the eternal Person. This is my belief."
    },
    {
      "index": 433,
      "text": "11:19  I see You as without beginning, middle and end, possessed of infinite valour, having innumerable arms, having the sun and the moon as eyes, having a mouth like a blazing fire, and heating up this Universe by Your own brilliance."
    },
    {
      "index": 434,
      "text": "11:20  Indeed, this intermediate space between heaven and earth as also all the directions are pervaded by You alone. O exalted One, the three worlds are struck with fear by seeing this strange, fearful form of Yours."
    },
    {
      "index": 435,
      "text": "11:21  Those very groups of gods enter into You; struck with fear, some extol (You) with joined palms. Groups of great sages and perfected beings praise You with elaborate hymns, saying 'May it be well!'"
    },
    {
      "index": 436,
      "text": "11:22  Those who are the Rudras, the Adityas, the Vasus and the Sadhyas [sadhyas: A particular class of celestial beings.], the Visve (-devas), the two Asvins, the Maruts and the Usmapas, and hosts of Gandharvas, Yaksas, demons and Siddhas-all of those very one\u2019s gaze at You, being indeed struck with wonder."
    },
    {
      "index": 437,
      "text": "11:23  O mighty-armed One, seeing Your immense form with many mouths and eyes, having numerous arms, thighs and feet, with many bellies, and fearful with many teeth, the creatures are struck with terror, and so am I."
    },
    {
      "index": 438,
      "text": "11:24  O Visnu, verily, seeing Your form touching heaven, blazing, with many colours, open-mouthed, with fiery large eyes, I, becoming terrified in my mind, do not find steadiness and peace."
    },
    {
      "index": 439,
      "text": "11:25  Having merely seen Your mouths made terrible with (their) teeth and resembling the fire of Dissolution, I have lost the sense of direction and find no comfort. Be gracious, O Lord of gods, O Abode of the Universe."
    },
    {
      "index": 440,
      "text": "11:26  And into You (enter) all those sons of Dhrtarastra along with multitudes of the rulers of the earth; (also) Bhisma, Drona and that son of a Suta (Karna), together with even our prominent warriors. They rapidly enter into Your terrible mouths with cruel teeth! Some are seen sticking in the gaps between the teeth, with their heads crushed!"
    },
    {
      "index": 441,
      "text": "11:27  And into You (enter) all those sons of Dhrtarastra along with multitudes of the rulers of the earth; (also) Bhisma, Drona and that son of a Suta (Karna), together with even our prominent warriors. They rapidly enter into Your terrible mouths with cruel teeth! Some are seen sticking in the gaps between the teeth, with their heads crushed!"
    },
    {
      "index": 442,
      "text": "11:28  As the numerous currents of the waters of rivers rush towards the sea alone so also do those heroes of the human world enter into Your blazing mouths."
    },
    {
      "index": 443,
      "text": "11:29  As moths enter with increased haste into a glowing fire for destruction, in that very way do the creatures enter into Your mouths too, with increased hurry for destruction."
    },
    {
      "index": 444,
      "text": "11:30  You lick Your lips while devouring all the creatures from every side with flaming mouths which are completely filling the entire world with heat."
    },
    {
      "index": 445,
      "text": "11:31  Tell me who You are, fierce in form. Salutation be to you, O supreme God; be gracious. I desire to fully know You who are the Prima One. For I do not understand Your actions!"
    },
    {
      "index": 446,
      "text": "11:32  The Blessed Lord said: I am the world-destroying Time, [Time: The supreme God with His limiting adjunct of the power of action.] grown in stature [Pravrddhah, mighty] and now engaged in annihilating the creatures. Even without you, all the warriors who are arrayed in the confronting armies will cease to exist!"
    },
    {
      "index": 447,
      "text": "11:33  Therefore you rise up, (and) gain fame; and defeating the enemies, enjoy a prosperous kingdom. These have been killed verily by Me even earlier; be you merely an instrument, O Savyasacin (Arjuna)."
    },
    {
      "index": 448,
      "text": "11:34  You destroy Drona and Bhisma, and Jayadratha and Karna as also the other heroic warriors who have been killed by Me. Do not be afraid. Fight! You shall conquer the enemies in battle."
    },
    {
      "index": 449,
      "text": "11:35  Sanjaya said: Hearing this utterance of Kesava, Kiriti (Arjuna), with joined palms and trembling, prostrating himself, said again to Krsna with a faltering voice, bowing down overcome by fits of fear:"
    },
    {
      "index": 450,
      "text": "11:36  Arjuna said: It is proper, O Hrsikesa, that the world becomes delighted and attracted by Your praise; that the Raksasas, stricken with fear, run in all directions; and that all the groups of the Siddhas bow down (to You)."
    },
    {
      "index": 451,
      "text": "11:37  And why should they not bow down to You, O exalted [i.e. not narrow-minded.] One, who are greater (than all) and who are the first Creator even of Brahma! O infinite One, supreme God, Abode of the Universe, You are the Immutable, being and non-being, (and) that which is Transcendental."
    },
    {
      "index": 452,
      "text": "11:38  You are the primal Deity, the ancient Person; You are the supreme Resort of this world. You are the knower as also the object of knowledge, and the supreme Abode. O You of infinite forms, the Universe is pervaded by You!"
    },
    {
      "index": 453,
      "text": "11:39  You are Air, Death, Fire, the god of the waters, the moon, the Lord of the creatures, and the Greater-grandfather. Salutations! Salutation be to You a thousand times; salutation to You again and again! Salutation!"
    },
    {
      "index": 454,
      "text": "11:40  Salutation to You in the East and behind. Salutation be to You on all sides indeed, O All! You are possessed of infinite strength and infinite heroism. You pervade everything; hence You are all!"
    },
    {
      "index": 455,
      "text": "11:41  Without knowing this greatness of Yours, whatever was said by me (to You) rashly, through inadvertence or even out of intimacy, thinking (You to be) a friend, addressing (You) as 'O Krsna,' 'O Yadava,' 'O friend,' etc.-."
    },
    {
      "index": 456,
      "text": "11:42  And that You have been discourteously treated out of fun-while walking, while on a bed, while on a seat, while eating, in privacy, or, O Acyuta, even in public, for that I beg pardon of You, the incomprehensible One."
    },
    {
      "index": 457,
      "text": "11:43  You are the Father of all beings moving and non-moving; to this (world) You are worthy of worship, the Teacher, and greater (than a teacher). There is none equal to You; how at all can there be anyone greater even in all the three worlds, O You or unrivalled power?"
    },
    {
      "index": 458,
      "text": "11:44  Therefore, by bowing down and prostrating the body, I seek to propitiate You who are God and are adorable. O Lord, You should forgive (my faults) as would a father (the faults) of a son, as a friend, of a friend, and as a lover of a beloved."
    },
    {
      "index": 459,
      "text": "11:45  I am delighted by seeing something not seen heretofore, and my mind is stricken with fear. O Lord, show me that very form; O supreme God, O Abode of the Universe, be gracious!"
    },
    {
      "index": 460,
      "text": "11:46  I want to see You just as before, wearing a crown, wielding a mace, and holding a disc in hand. O You with thousand arms, O You of Cosmic form, appear with that very form with four hands."
    },
    {
      "index": 461,
      "text": "11:47  The Blessed Lord said: Out of grace, O Arjuna, this supreme, radiant, Cosmic, infinite, primeval form-which (form) of Mine has not been seen before by anyone other than you, has been shown to you by Me through the power of My Own Yoga."
    },
    {
      "index": 462,
      "text": "11:48  Not by the study of the Vedas and sacrifices, not by gifts, not even by rituals, not by severe austerities can I, in this form, be perceived in the human world by anyone ['By anyone who has not received My grace'. other than you, O most valiant among the Kurus."
    },
    {
      "index": 463,
      "text": "11:49  May you have no fear, and may not there be bewilderment by seeing this form of Mine so terrible Becoming free from fear and gladdened in mind again, see this very earlier form of Mine."
    },
    {
      "index": 464,
      "text": "11:50  Sanjaya said: Thus, having spoken to Arjuna in that manner, Vasudeva showed His own form again. And He, the exalted One, reassured this terrified one by again becoming serene in form."
    },
    {
      "index": 465,
      "text": "11:51  Arjuna said: O Janardana, having seen this serene human form of Yours, I have now become calm in mind and restored to my own nature."
    },
    {
      "index": 466,
      "text": "11:52  The Blessed Lord said: This form of Mine which you have seen is very difficult to see; even the gods are ever desirous of a vision of this form."
    },
    {
      "index": 467,
      "text": "11:53  Not through the Vedas, not by austerity, not by gifts, nor even by sacrifice can I be seen in this form as you have seen Me."
    },
    {
      "index": 468,
      "text": "11:54  But, O Arjuna, by single-minded devotion am I-in this form-able to be known and seen in reality, and also be entered into, O destroyer of foes."
    },
    {
      "index": 469,
      "text": "11:55  O son of Pandu, he who works for Me, accepts Me as the supreme Goal, is devoted to Me, is devoid of attachment and free from enmity towards all beings-he attains Me."
    },
    {
      "index": 470,
      "text": "12:1  Arjuna said: Those devotees who, being thus ever dedicated, meditate on You, and those again (who meditate) on the Immutable, the Unmanifested-of them, who are the best experiencers of yoga [(Here) yoga means samadhi, spiritual absorption.] ?"
    },
    {
      "index": 471,
      "text": "12:2  The Blessed Lord said: Those who meditate on Me by fixing their minds on Me with steadfast devotion (and) being endowed with supreme faith-they are considered to be the most perfect yogis according to Me."
    },
    {
      "index": 472,
      "text": "12:3  Those, however, who meditate in every way on the Immutable, the Indefinable, the Unmanifest, which is all-pervading, incomprehensible, change-less, immovable and constant. By fully controlling all the organs and always being even-minded, they, engaged in the welfare of all beings, attain Me alone."
    },
    {
      "index": 473,
      "text": "12:4  Those, however, who meditate in every way on the Immutable, the Indefinable, the Unmanifest, which is all-pervading, incomprehensible, change-less, immovable and constant. By fully controlling all the organs and always being even-minded, they, engaged in the welfare of all beings, attain Me alone."
    },
    {
      "index": 474,
      "text": "12:5  For them who have their minds attached to the Unmanifested the struggle is greater; for, the Goal which is the Unmanifest is attained with difficulty by the embodied ones."
    },
    {
      "index": 475,
      "text": "12:6  As for those who, having dedicated all actions to Me and accepted Me as the supreme, meditate by thinking of Me with single-minded concentration only-."
    },
    {
      "index": 476,
      "text": "12:7  O son of Prtha, for them who have their minds absorbed in Me, I become, without delay, the Deliverer from the sea of the world which is fraught with death."
    },
    {
      "index": 477,
      "text": "12:8  Fix the mind on Me alone; in Me alone rest the intellect. There is no doubt that hereafter you will dwell in Me alone."
    },
    {
      "index": 478,
      "text": "12:9  If, however, you are unable to establish the mind steadily on Me, then, O Dhananjaya, seek to attain Me through the Yoga of Practice."
    },
    {
      "index": 479,
      "text": "12:10  If you are unable even to practise, be intent on works for Me. By undertaking works for Me as well, you will attain perfection. [Identity with Brahman.]"
    },
    {
      "index": 480,
      "text": "12:11  If you are unable to do even this, in that case, having resorted to the Yoga for Me, thereafter renounce the results of all works by becoming controlled in mind."
    },
    {
      "index": 481,
      "text": "12:12  Knowledge is surely superior to practice; meditation surpasses knowledge. The renunciation of the results of works (excels) meditation. From renunciation, Peace follows immediately."
    },
    {
      "index": 482,
      "text": "12:13  He who is not hateful towards any creature, who is friendly and compassionate, who has no idea of 'mine' and the idea of egoism, who is the same under sorrow and happiness, who is forgiving;"
    },
    {
      "index": 483,
      "text": "12:14  He who is ever content, who is a yogi, who has self-control, who has firm conviction, who has dedicated his mind and intellect to Me-he who is such a devotee of Mine is dear to Me."
    },
    {
      "index": 484,
      "text": "12:15  He, too, owing to whom the world is not disturbed, and who is not disturbed by the world, who is free from joy, impatience, fear and anxiety, is dear to Me."
    },
    {
      "index": 485,
      "text": "12:16  He who has no desires, who is pure, who is dextrous, who is impartial, who is free from fear, who has renounced every undertaking-he who is (such) a devotee of Mine is dear to Me."
    },
    {
      "index": 486,
      "text": "12:17  He who does not rejoice, does not fret, does not lament, does not hanker; who gives up good and bad, who is filled with devotion-he is dear to Me."
    },
    {
      "index": 487,
      "text": "12:18  He who is the same towards friend and foe, and so also in honour and dishonour; who is the same under cold, heat, happiness and sorrow, who is free from attachment to everything."
    },
    {
      "index": 488,
      "text": "12:19  The person to whom denunciation and praise are the same, who is silent, content with anything, homeless, steady-minded, and full of devotion is dear to Me."
    },
    {
      "index": 489,
      "text": "12:20  But [Tu (but) is used to distinguish those who have attained the highest Goal from the aspirants.] those devotees who accept Me as the supreme Goal, and with faith seek for this ambrosia which is indistinguishable from the virtues as stated above, they are very dear to Me."
    },
    {
      "index": 490,
      "text": "13:1  Arjun said: O Keshav, I wish to understand what are prak\u1e5biti and puru\u1e63h, and what are kshetra(field) and kshetrayajna(knower of the field)? I also wish to know what is true knowledge, and what is the goal of this knowledge?"
    },
    {
      "index": 491,
      "text": "13:2  The Blessed Lord said: O son of Kunti, this body is referred to as the 'field'. Those who are versed in this call him who is conscious of it as the 'knower of the field'."
    },
    {
      "index": 492,
      "text": "13:3  And, O scion of the Bharata dynasty, under-stand Me to be the 'Knower of the field' in all the fields. In My opinion, that is Knowledge which is the knowledge of the field and the knower of the field."
    },
    {
      "index": 493,
      "text": "13:4  Hear from Me in brief about (all) that as to what that field is and how it is; what its changes are, and from what cause arises what effect; and who He is, and what His powers are."
    },
    {
      "index": 494,
      "text": "13:5  It has been sung of in various ways by the Rshis, separately by the different kinds [The different branches of Vedic texts.] of Vedic texts, and also by the rational and convincing sentences themselves which are indicative of and lead to Brahman."
    },
    {
      "index": 495,
      "text": "13:6  The great elements, egoism, intellect and the Unmanifest itself; the ten organs and the one, and the five objects of the senses;"
    },
    {
      "index": 496,
      "text": "13:7  Desire, repulsion, happiness, sorrow, the aggregate (of body and organs), sentience, fortitude- this field, together with its modifications, has been spoken of briefly."
    },
    {
      "index": 497,
      "text": "13:8  Humility, unpretentiousness, non-injury, for-bearance, sincerity, service of the teacher, cleanliness, steadiness, control of body and organs;"
    },
    {
      "index": 498,
      "text": "13:9  Non-attachment with regard to objects of the senses, and also absence of egotism; seeing the evil in birth, death, old age, diseases and miseries;"
    },
    {
      "index": 499,
      "text": "13:10  Non-attachment and absence of fondness with regard to sons, wives, homes, etc., and constant equanimity of the mind with regard to the attainment of the desirable and the undesirable;"
    },
    {
      "index": 500,
      "text": "13:11  And unwavering devotion to Me with single-minded concentration; inclination to repair into a clean place; lack of delight in a crowd of people;"
    },
    {
      "index": 501,
      "text": "13:12  Steadfastness in the knowledge of the Self, contemplation on the Goal of the knowledge of Reality-this is spoken of as Knowledge. Ignorance is that which is other than this."
    },
    {
      "index": 502,
      "text": "13:13  I shall speak of that which is to be known, by realizing which one attains Immortality. The supreme Brahman is without any beginning. That is called neither being nor non-being."
    },
    {
      "index": 503,
      "text": "13:14  That (Knowable), which has hands and feet everywhere, which has eyes, heads and mouths everywhere, which has ears everywhere, exists in creatures by pervading them all."
    },
    {
      "index": 504,
      "text": "13:15  Shining through the functions of all the organs, (yet) devoid of all the organs; unattached, and verily the supporter of all; without quality, and the perceiver of qualities;"
    },
    {
      "index": 505,
      "text": "13:16  Existing outside and inside all beings; moving as well as non-moving, It is incomprehensible due to subtleness. So also, It is far away, and yet near."
    },
    {
      "index": 506,
      "text": "13:17  And the Knowable, though undivided, appears to be existing as divided in all beings, and It is the sustainer of all beings as also the devourer and originator."
    },
    {
      "index": 507,
      "text": "13:18  That is the Light even of the lights; It is spoken of as beyond darkness. It is Knowledge, the Knowable, and the Known. It exists specially in the hearts of all."
    },
    {
      "index": 508,
      "text": "13:19  Thus has been spoken of in brief the field as also Knowledge and the Knowable. By understanding this My devotee becomes qualified for My state."
    },
    {
      "index": 509,
      "text": "13:20  Know both Nature and also the individual soul to be verily without beginning; know the modifications as also the qualities as born of Nature."
    },
    {
      "index": 510,
      "text": "13:21  With regard to the source of body and organs, Nature is said to be the cause. The soul is the cause so far as enjoyer-ship of happiness and sorrow is concerned."
    },
    {
      "index": 511,
      "text": "13:22  Since the soul is seated in Nature, therefore it experiences the qualities born of Nature. Contact with the qualities is the cause of its births in good and evil wombs."
    },
    {
      "index": 512,
      "text": "13:23  He who is the Witness, the Permitter, the Sustainer, the Experiencer, the great Lord, and who is also spoken of as the transcendental Self is the supreme Person in this body."
    },
    {
      "index": 513,
      "text": "13:24  He who knows thus the Person and Nature along with the qualities will not be born again, in whatever way he may live."
    },
    {
      "index": 514,
      "text": "13:25  Through meditation some realize the Self in (their) intellect with the help of the internal organs; others through Sankhya-yoga, and others through Karma-yoga."
    },
    {
      "index": 515,
      "text": "13:26  Others, again, who do not know thus, take to thinking after hearing from others; they, too, who are devoted to hearing, certainly overcome death."
    },
    {
      "index": 516,
      "text": "13:27  O scion of the Bharata dynasty, whatever object, moving or non-moving, comes into being, know that to be from the association of the field and the Knower of the field!"
    },
    {
      "index": 517,
      "text": "13:28  He sees who sees the supreme Lord as existing equally in all beings, and as the Imperishable among the perishable."
    },
    {
      "index": 518,
      "text": "13:29  Since by seeing equally God who is present alike everywhere he does not injure the Self by the Self, therefore he attains the supreme Goal."
    },
    {
      "index": 519,
      "text": "13:30  And he who sees actions as being done in various ways by Nature itself, and also the Self as the non-agent, -he sees."
    },
    {
      "index": 520,
      "text": "13:31  When one realizes that the state of diversity of living things is rooted in the One, and that their manifestation is also from That, then one becomes identified with Brahman."
    },
    {
      "index": 521,
      "text": "13:32  Being without beginning and without qualities, O son of Kunti, this immutable, supreme Self does not act nor is It affected, although existing in the body."
    },
    {
      "index": 522,
      "text": "13:33  As the all-pervading space is not defiled, because of its subtlety, similarly the Self, present everywhere in the body, is not defiled."
    },
    {
      "index": 523,
      "text": "13:34  As the single sun illumines this whole world, similarly, O descendant of the Bharata dynasty, the Knower of the field illumines the whole field."
    },
    {
      "index": 524,
      "text": "13:35  Those who know thus through the eye of wisdom the distinction between the field and the Knower of the field, and the annihilation of the Matrix of beings, -they reach the Supreme."
    },
    {
      "index": 525,
      "text": "14:1  The Blessed Lord said: I shall speak again of the supreme Knowledge, the best of all knowledges, by realizing which all the contemplatives reached the highest Perfection from here."
    },
    {
      "index": 526,
      "text": "14:2  Those who attain identity with Me by resorting of this Knowledge are not born even during creation, nor do they suffer pain during dissolution."
    },
    {
      "index": 527,
      "text": "14:3  My womb is the great-sustainer. In that I place the seed. From that, O scion of the Bharata dynasty, occurs the birth of all things."
    },
    {
      "index": 528,
      "text": "14:4  O son of Kunti, whatever forms are born from all the wombs, of them the great-sustainer is the womb; I am the father who deposits the seed."
    },
    {
      "index": 529,
      "text": "14:5  O mighty-armed one, the qualities, viz sattva, rajas and tamas, born of Nature, being the immutable embodies being to the body."
    },
    {
      "index": 530,
      "text": "14:6  Among them, sattva, being pure, [Nirmala, pure-transparent, i.e., capable of resisting any form of ignorance, and hence as illuminator, i.e. a revealer of Consciousness.] is an illuminator and is harmless. O sinless one, it binds through attachment to happiness and attachment to knowledge."
    },
    {
      "index": 531,
      "text": "14:7  Know rajas to be of the nature of passion, born of hankering and attachment. O son of Kunti, that binds the embodied one through attachment to action."
    },
    {
      "index": 532,
      "text": "14:8  On the other hand, know tamas, which deludes all embodied beings, to be born of ignorance. O scion of the Bharata dynasty, that binds through inadvertence, laziness and sleep."
    },
    {
      "index": 533,
      "text": "14:9  O scion of the Bharata dynasty, sattva attaches one to happiness, rajas to action, while tamas, covering up knowledge, leads to inadvertence also."
    },
    {
      "index": 534,
      "text": "14:10  O scion of the Bharata dynasty, sattva increases by subduing rajas and tamas, rajas by overpowering sattva and tamas, and tamas by dominating over sattva and rajas."
    },
    {
      "index": 535,
      "text": "14:11  When the illumination that is knowledge radiates in this body through all the doors (of the senses), then one should know that sattva has increased greatly."
    },
    {
      "index": 536,
      "text": "14:12  O best of the Bharata dynasty, when rajas becomes predominant, these come into being: avarice, movement, undertaking of actions, unrest and hankering."
    },
    {
      "index": 537,
      "text": "14:13  O descendant of the Kuru dynasty, when tamas predominates these surely come into being: non-discrimination and inactivity, inadvertence and delusion."
    },
    {
      "index": 538,
      "text": "14:14  When an embodied one undergoes death while sattva is exclusively predominant, then he attains the taintless worlds of those who know the highest (entities)."
    },
    {
      "index": 539,
      "text": "14:15  When one dies while rajas predominates, he is born among people attached to activity. Similarly, when one dies while tamas predominates, he takes birth among the stupid species."
    },
    {
      "index": 540,
      "text": "14:16  They say that the result of good work is pure and is born of sattva. But the result of rajas is sorrow; the result of tamas is ignorance."
    },
    {
      "index": 541,
      "text": "14:17  From sattva is born knowledge [Knowledge acquired through the sense-organs.], and from rajas, verily, avarice. From tamas are born inadvertence and delusion as also ignorance, to be sure."
    },
    {
      "index": 542,
      "text": "14:18  People who conform to sattva go higher up; those who conform to rajas stay in the middle; those who conform to tamas, who conform to the actions of the lowest quality, go down."
    },
    {
      "index": 543,
      "text": "14:19  When the witness sees none other than the qualities as the agent, and knows that which is superior [i.e. different from.] to the qualities, he attains My nature."
    },
    {
      "index": 544,
      "text": "14:20  Having transcended these three qualities which are the origin of the body, the embodied one, becoming free from birth, death, old age and sorrows, experiences Immortality."
    },
    {
      "index": 545,
      "text": "14:21  Arjuna said: O Lord, by what signs is one (known) who has gone beyond these three qualities? What is his behaviour, and how does he transcend these three qualities?"
    },
    {
      "index": 546,
      "text": "14:22  The Blessed Lord said: O son of Pandu, he neither dislikes illumination (knowledge), activity and delusion when they appear, nor does he long for them when they disappear."
    },
    {
      "index": 547,
      "text": "14:23  He who, sitting like one indifferent, is not distracted by the three qualities; he who, thinking that the qualities alone act, remains firm and surely does not move;"
    },
    {
      "index": 548,
      "text": "14:24  He to whom sorrow and happiness are alike, who is established in his own Self, to whom a lump of earth, iron and gold are the same, to whom the agreeable and the disagreeable are the same, who is wise, to whom censure and his own praise are the same;"
    },
    {
      "index": 549,
      "text": "14:25  He who is the same under honour and dishonour, who is equally disposed both towards the side of the friend and of the foe, who has renounced all enterprise, -he is said to have gone beyond the qualities."
    },
    {
      "index": 550,
      "text": "14:26  And he who serves Me through the unswerving Yoga of Devotion, he, having gone beyond these qualities, qualifies for becoming Brahman."
    },
    {
      "index": 551,
      "text": "14:27  For I am the Abode of Brahman-the indestructible and immutable, the eternal, the Dharma and absolute Bliss."
    },
    {
      "index": 552,
      "text": "15:1  The Blessed Lord said: They say that the peepul Tree, which has its roots upward and the branches downward, and of which the Vedas are the leaves, is imperishable. He who realizes it is knower of the Vedas."
    },
    {
      "index": 553,
      "text": "15:2  The branches of that (Tree), extending down-wards and upwards, are strengthened by the qualities and have sense-objects as their shoots. And the roots, which are followed by actions, spread down-wards in the human world."
    },
    {
      "index": 554,
      "text": "15:3  Its form is not perceived here in that way; nor its end, nor beginning, nor continuance, after felling this Peepul whose roots are well developed, with the strong sword of detachment-;"
    },
    {
      "index": 555,
      "text": "15:4  Thereafter, that State has to be sought for, going where they do not return again: I take refuge in that Primeval Person Himself, from whom has ensued the eternal Manifestation."
    },
    {
      "index": 556,
      "text": "15:5  The wise ones who are free from pride and non-discrimination, who have conquered the evil of association, [Hatred and love arising from association with foes and friends.] who are ever devoted to spirituality, completely free from desires, free from the dualities called happiness and sorrow, reach that undecaying State."
    },
    {
      "index": 557,
      "text": "15:6  Neither the sun nor the moon nor fire illumines That. That is My Supreme Abode, reaching which they do not return."
    },
    {
      "index": 558,
      "text": "15:7  It is verily a part of Mine which, becoming the eternal individual soul in the region of living beings, draws (to itself) the organs which have the mind as their sixth, and which abide in Nature."
    },
    {
      "index": 559,
      "text": "15:8  When the master leaves it and even when he assumes a body, he departs taking these, as wind (carries away) odours from their receptacles."
    },
    {
      "index": 560,
      "text": "15:9  This one enjoys the objects by presiding over the ear, eyes, skin and tongue as also the nose and the mind."
    },
    {
      "index": 561,
      "text": "15:10  Persons who are diversely deluded do not see it even when it is leaving or residing (in this body), or experiencing, or in association with the qualities. Those with the eye of knowledge see."
    },
    {
      "index": 562,
      "text": "15:11  And the yogis who are diligent see this one as existing in themselves. The non-discriminating ones who lack self-control do not see this one-though (they be) diligent."
    },
    {
      "index": 563,
      "text": "15:12  That light in the sun which illumines the whole world, that which is in the moon, and that which is in fire, -know that light to be Mine."
    },
    {
      "index": 564,
      "text": "15:13  And entering the earth I sustain the beings through (My) power; and nourish all the plants by becoming Soma which is of the nature of sap."
    },
    {
      "index": 565,
      "text": "15:14  Taking the form of Vaisvanara and residing in the bodies of creatures, I, in association with Prana and Apana, digest the four kinds of food."
    },
    {
      "index": 566,
      "text": "15:15  And I am seated in the hearts of all. From Me are memory, knowledge and their loss. I alone am the object to be known through all the Vedas; I am also the originator of the Vedanta, and I Myself am the knower of the Vedas."
    },
    {
      "index": 567,
      "text": "15:16  There are these two persons in the world-the mutable and the immutable. The mutable consists of all things; the one existing as Maya is called the immutable."
    },
    {
      "index": 568,
      "text": "15:17  But different is the supreme Person who is spoken of as the transcendental Self, who, permeating the three worlds, upholds (them), and is the imperishable God."
    },
    {
      "index": 569,
      "text": "15:18  Since I am transcendental to the mutable and above even the immutable, hence I am well known in the world and in the Vedas as the supreme Person."
    },
    {
      "index": 570,
      "text": "15:19  O scion of the Bharata dynasty, he who, being free from delusion, knows Me the supreme Person thus, he is all-knowing and adores Me with his whole being."
    },
    {
      "index": 571,
      "text": "15:20  O sinless one, this most secret scripture has thus been uttered by Me. Understanding this, one becomes wise and has his duties fulfilled, O scion of the Bharata dynasty."
    },
    {
      "index": 572,
      "text": "16:1  The Blessed Lord said: Fearlessness, purity of mind, persistence in knowledge and yoga, charity and control of the external organs, sacrifice, (scriptural) study, austerity and rectitude;"
    },
    {
      "index": 573,
      "text": "16:2  Non-injury, truthfulness, absence of anger, renunciation, control of the internal organ, absence of vilification, kindness to creatures, non-covetousness, gentleness, modesty, freedom from restlessness;"
    },
    {
      "index": 574,
      "text": "16:3  Vigour, forgiveness, fortitude, purity, freedom from malice, absence of haughtiness-these, O scion of the Bharata dynasty, are (the qualities) of one born destined to have the divine nature."
    },
    {
      "index": 575,
      "text": "16:4  O son of Prtha, (the attributes) of one destined to have the demoniacal nature are religious ostentation, pride and haughtiness, anger as also rudeness and ignorance."
    },
    {
      "index": 576,
      "text": "16:5  The divine nature is the Liberation, the demoniacal is considered to be for inevitable bondage. Do not grieve, O son of Pandu! You are destined to have the divine nature."
    },
    {
      "index": 577,
      "text": "16:6  In this world there are two (kinds of) creation of beings: the divine and the demoniacal. The divine has been spoken of elaborately. Hear about the demoniacal from Me, O son of Prtha."
    },
    {
      "index": 578,
      "text": "16:7  Neither do the demoniacal persons under-stand what is to be done and what is not to be done; nor does purity, or even good conduct or truthfulness exist in them."
    },
    {
      "index": 579,
      "text": "16:8  They say that the world is unreal, it has no basis, it is without a God. It is born of mutual union brought about by passion! What other (cause can there be)?"
    },
    {
      "index": 580,
      "text": "16:9  Holding on to this view, (these people) who are of depraved character, of poor intellect, given to fearful actions and harmful, wax strong for the ruin of the world."
    },
    {
      "index": 581,
      "text": "16:10  Giving themselves up to insatiable passion, filled with vanity, pride and arrogance, adopting bad objectives due to delusion, and having impure resolves, they engage in actions."
    },
    {
      "index": 582,
      "text": "16:11  Beset with innumerable cares which end (only) with death, holding that the enjoyment of desirable objects is the highest goal, feeling sure that this is all."
    },
    {
      "index": 583,
      "text": "16:12  Bound by hundreds of shackles in the form of hope, giving themselves wholly to passion and anger, they endeavour to amass wealth through foul means for the enjoyment of desirable objects."
    },
    {
      "index": 584,
      "text": "16:13  This has been gained by me today; I shall acquire this desired object. This is in hand; again, this wealth also will come to me."
    },
    {
      "index": 585,
      "text": "16:14  That enemy has been killed by me, and I shall kill others as well. I am the lord, I am the enjoyer, I am well-established, mighty and happy."
    },
    {
      "index": 586,
      "text": "16:15  I am rich and high-born; who else is there similar to me? I shall perform sacrifices; I shall give, I shall rejoice,'-thus they are diversely deluded by non-discrimination. Bewildered by numerous thoughts, caught in the net of delusion, (and) engrossed in the enjoyment of desirable objects, they fall into a foul hell."
    },
    {
      "index": 587,
      "text": "16:16  I am rich and high-born; who else is there similar to me? I shall perform sacrifices; I shall give, I shall rejoice,'-thus they are diversely deluded by non-discrimination. Bewildered by numerous thoughts, caught in the net of delusion, (and) engrossed in the enjoyment of desirable objects, they fall into a foul hell."
    },
    {
      "index": 588,
      "text": "16:17  Self-conceited, haughty, filled with pride and intoxication of wealth, they perform sacrifices which are so in name only, with ostentation and regardless of the injunctions."
    },
    {
      "index": 589,
      "text": "16:18  Resorting to egotism, power, arrogance, passion and anger, hating Me in their own and others' bodies, (they become) envious by nature."
    },
    {
      "index": 590,
      "text": "16:19  I cast for ever those hateful, cruel, evil-doers in the worlds, the vilest of human beings, verily into the demoniacal classes."
    },
    {
      "index": 591,
      "text": "16:20  Being born among the demoniacal species in births after births, the foods, without ever reaching Me, O son of Kunti, attain conditions lower than that."
    },
    {
      "index": 592,
      "text": "16:21  This door of hell, which is the destroyer of the soul, is of three kinds-passion, anger and also greed. Therefore, one should forsake these three."
    },
    {
      "index": 593,
      "text": "16:22  O son of Kunti, a person who is free from these three doors to darkness strives for the good of the soul. Then, he attains the highest Goal."
    },
    {
      "index": 594,
      "text": "16:23  Ignoring the precept of the scriptures, he who acts under the impulsion of passion, -he does not attain perfection, nor happiness, nor the supreme Goal."
    },
    {
      "index": 595,
      "text": "16:24  Therefore, the scripture is your authority as regards the determination of what is to be done and what is not to be done. After understanding (your) duty as presented by scriptural injunction, you ought to perform (your duty) here."
    },
    {
      "index": 596,
      "text": "17:1  Arjuna said: But, O Krsna, what is the state [i.e., where do the rites undertaken by them end?] of those who, endued with faith, adore [Adore-perform sacrifices, distribute wealth etc. in honour of gods and others.] by ignoring the injunctions of the scriptures? Is it sattva, rajas or tamas?"
    },
    {
      "index": 597,
      "text": "17:2  The Blessed Lord said: That faith of the embodied beings, born of their own nature, is threefold-born of sattva, rajas and tamas. Hear about it."
    },
    {
      "index": 598,
      "text": "17:3  O scion of the Bharata dynasty, the faith of all beings is in accordance with their minds. This person is made up of faith as the dominant factor. He is verily what his faith is."
    },
    {
      "index": 599,
      "text": "17:4  Those having the sattva quality worship the gods; those having rajas, the demi-gods and ogres; and other people possessed of tamas worship ghosts and the hosts of spirits."
    },
    {
      "index": 600,
      "text": "17:5  Those persons who, given to ostentation and pride, and possessed of passion, attachment and strength, undertake severe austerities not sanctioned in the scriptures;"
    },
    {
      "index": 601,
      "text": "17:6  (And who,) being non-discriminating, torture, all the organs in the body as also even Me who reside in the body, -know them as possessed of demoniacal conviction."
    },
    {
      "index": 602,
      "text": "17:7  Food also, which is dear to all, is of three kinds; and so also are sacrifices, austerity and charity. Listen to this classification of them."
    },
    {
      "index": 603,
      "text": "17:8  Foods that augment life, firmness of mind, strength, health, happiness and delight, and which are succulent, oleaginous, substantial and agreeable, are dear to one endowed with sattva."
    },
    {
      "index": 604,
      "text": "17:9  Foods that are bitter, sour, salty, very hot, pungent, dry and burning, and which production pain, sorrow and disease, are dear to one having rajas."
    },
    {
      "index": 605,
      "text": "17:10  Food which is not properly cooked, lacking in essence, putrid and stale, and even ort and that which is unfit for sacrifice, is dear to one possessed of tamas."
    },
    {
      "index": 606,
      "text": "17:11  That sacrifice which is in accordance with the injunctions, (and is) performed by persons who do not hanker after results, and with the mental conviction that it is surely obligatory, is done through sattva."
    },
    {
      "index": 607,
      "text": "17:12  But that sacrifice which is performed having in view a result, as also for ostentation, -know that sacrifice to be done through rajas, O greatest among the descendants of Bharata."
    },
    {
      "index": 608,
      "text": "17:13  They declare that sacrifice as 'done through tamas' which is contrary to injunction, in which food is not distributed, in which mantras are not used, in which offerings are not made to priests, and which is devoid of faith."
    },
    {
      "index": 609,
      "text": "17:14  The worship of gods, twice-born, venerable persons and the wise; purity, straightforwardness, celibacy and non-injury, -are said to be bodily austerity."
    },
    {
      "index": 610,
      "text": "17:15  That speech which causes no pain, which is true, agreeable and beneficial; as well as the practice of study of the scriptures, -is said to be austerity of speech."
    },
    {
      "index": 611,
      "text": "17:16  Tranquillity of mind, gentleness, reticence, withdrawal of the mind, purity of heart, -these are what is called mental austerity."
    },
    {
      "index": 612,
      "text": "17:17  When that threefold austerity is undertaken with supreme faith by people who do not hanker after results and are self-controlled, they speak of it as born of sattva."
    },
    {
      "index": 613,
      "text": "17:18  That austerity which is undertaken for earning a name, being honoured and worshipped, and also ostentatiously, -that is spoken of as born of rajas, belonging to this world, uncertain and transitory."
    },
    {
      "index": 614,
      "text": "17:19  That austerity which is undertaken with a foolish intent, by causing pain to oneself, or for the destruction of others-that is said to be born of tamas."
    },
    {
      "index": 615,
      "text": "17:20  That gift is referred to as born of sattva which gift is given with the idea that it ought to be given, to one who will not serve in return, and at the (proper) place, (proper) time and to a (proper) person."
    },
    {
      "index": 616,
      "text": "17:21  But the gift which is given expecting reciprocation, or again, with a desire for its result, and which is given grudgingly, - that is considered to be born of rajas."
    },
    {
      "index": 617,
      "text": "17:22  The gift which is made at an improper place and time, and to undeserving persons, without proper treatment and with disdain, is declared to be born of tamas."
    },
    {
      "index": 618,
      "text": "17:23  'Om-tat-sat' ['Om, That, Existence': 'Om iti brahma, Om is Brahman'; 'Tattvamasi, Thou art That'; and 'Sadeva somya idamagra asit, This was Existence alone in the beginning, O amiable one'-in these texts Brahman is indicated by the words Om, tat, sat.]-this is considered to be the threefold designation of Brahman. The Brahmanas and Vedas and the sacrifices were ordained by that in the days of yore."
    },
    {
      "index": 619,
      "text": "17:24  Therefore, acts of sacrifice, charity and austerity as prescribed through injunctions, of those who study and expound the Vedas, always commence after uttering the syllable Om."
    },
    {
      "index": 620,
      "text": "17:25  After (uttering) the word tat, acts of sacrifice and austerity as also the various acts of charity are performed without regard for results by persons aspiring for Liberation."
    },
    {
      "index": 621,
      "text": "17:26  This word sat is used with regard to (something) coming into being and with regard to (someone) becoming good. So also, O son of Prtha, the word sat is used with regard to an auspicious rite."
    },
    {
      "index": 622,
      "text": "17:27  And the steadfastness in sacrifice, austerity and charity is spoken of as sat. And even the action meant for these is, verily, called as sat (good)."
    },
    {
      "index": 623,
      "text": "17:28  O son of Prtha, whatever is offered in sacrifice and given in charity, as also whatever austerity is undertaken or whatever is done without, faith, is said to be of on avail. And it is of no conscience after death, nor here."
    },
    {
      "index": 624,
      "text": "18:1  Arjuna said: O mighty-armed Hrsikesa, O slayer of (the demon) Kesi, I want to know severally the truth about sannyasa as also about tyaga."
    },
    {
      "index": 625,
      "text": "18:2  The Blessed Lord said: The learned ones know sannyasa to be the giving up of actions done with a desire for reward. The adepts call the abandonment of the results of all works as tyaga."
    },
    {
      "index": 626,
      "text": "18:3  Some learned persons say that action, beset with evil (as it is), should be given up, and others (say) that the practice of sacrifice, charity and austerity should not be given up."
    },
    {
      "index": 627,
      "text": "18:4  O the most excellent among the descendants of Bharata, hear from Me the firm conclusion regarding that tyaga. For, O greatest among men, tyaga has been clearly declared to be of three kinds."
    },
    {
      "index": 628,
      "text": "18:5  The practice of sacrifice, charity and austerity is not to be abandoned; it is surely to be undertaken. Sacrifice, charity and austerity are verily the purifiers of the wise."
    },
    {
      "index": 629,
      "text": "18:6  But even these actions have to be undertaken by renouncing attachment and (hankering for) results. This is My firm and best conclusion, O Partha."
    },
    {
      "index": 630,
      "text": "18:7  The abandoning of daily obligatory acts (nityakamas) is not justifiable. Giving up that through delusion is declared to be based on tamas."
    },
    {
      "index": 631,
      "text": "18:8  Whatever action one may relinquish merely as being painful, from fear of physical suffering, he, having resorted to renunciation based on rajas, will surely not acquire the fruits of renunciation."
    },
    {
      "index": 632,
      "text": "18:9  Whatever obligatory duty is performed just because it is a bounden duty, O Arjuna, by giving up attachment and the result as well, -that renunciation is considered to be based on sattva."
    },
    {
      "index": 633,
      "text": "18:10  The man of renunciation who has become imbued with sattva, who is wise and freed from doubts, does not hate unbefitting action, nor does he become attached to befitting activity."
    },
    {
      "index": 634,
      "text": "18:11  Since it is not possible for one who holds on to a body to give up actions entirely, therefore he, on the other hand, who renounces results on actions is called a man of renunciation."
    },
    {
      "index": 635,
      "text": "18:12  The threefold results of actions-the undesirable, the desirable, and the mixed-accrues after death to those who do not resort to renunciation, but never to those who resort to monasticism."
    },
    {
      "index": 636,
      "text": "18:13  O mighty-armed one, learned from Me these five factors for the accomplishment of all actions, which have been spoken of in the Vedanta in which actions terminate."
    },
    {
      "index": 637,
      "text": "18:14  The locus as also the agent, the different kinds of organs, the many and distinct activities, and, the divine is here the fifth."
    },
    {
      "index": 638,
      "text": "18:15  Whatever action a man performs with the body, speech and mind, be it just or its reverse, of it these five are the causes."
    },
    {
      "index": 639,
      "text": "18:16  This being the case, anyone, who, owing to the imperfection of his intellect, perceives the absolute Self as the agent, that man does not perceive (properly), and has a perverted intellect."
    },
    {
      "index": 640,
      "text": "18:17  He who has not the feeling of egoism, whose intellect is not tainted, he does not kill, nor does he become bound-even by killing these creatures!"
    },
    {
      "index": 641,
      "text": "18:18  Knowledge, the object the knowledge and the knower-this is the threefold inducement to action. The comprehension of actions comes under three heads-the instruments, the object and the subject."
    },
    {
      "index": 642,
      "text": "18:19  Knowledge, action and agent are stated in the teaching about the gunas to be only of three kinds according to the differences of the gunas. Hear about them also as they are."
    },
    {
      "index": 643,
      "text": "18:20  Know that knowledge to be originating from sattva through which one sees a single, undecaying, undivided Entity in all the diversified things."
    },
    {
      "index": 644,
      "text": "18:21  But know that knowledge to be originating from rajas which, amidst all things, apprehends the different entities of various kinds as distinct [As possessing distinct selves.]."
    },
    {
      "index": 645,
      "text": "18:22  But that (knowledge) is said to be born of tamas which is confined to one form as though it were all, which is irrational, not concern with truth and trivial."
    },
    {
      "index": 646,
      "text": "18:23  The daily obligatory action which is performed without attachment and without likes or dislikes by one who does not hanker for rewards, that is said to be born of sattva."
    },
    {
      "index": 647,
      "text": "18:24  But that action is said to be born of rajas which is done by one desirous of results or by one who is egotistic, and which is highly strenuous."
    },
    {
      "index": 648,
      "text": "18:25  That action is said to be born of tamas which is undertaken out of delusion, (and) without consideration of its conscience, loss, harm and ability."
    },
    {
      "index": 649,
      "text": "18:26  The agent who is free from attachment [Attachment to results or the idea of agentship.], not egotistic, endowed with fortitude and diligence, and unperturbed by success and failure is said to be possessed of sattva."
    },
    {
      "index": 650,
      "text": "18:27  The agent who has attachment, who is desirous of the results of actions, covetous, cruel by nature, unclean and subject to joy and sorrow is declared to be possessed of rajas."
    },
    {
      "index": 651,
      "text": "18:28  The agent who is unsteady, naive, unbending, deceitful, wicked, lazy, morose and procrastinating is said to be possessed of tamas."
    },
    {
      "index": 652,
      "text": "18:29  O Dhananjaya, listen to the classification of the intellect as also of fortitude, which is threefold according to the gunas, while it is being stated elaborately and severally."
    },
    {
      "index": 653,
      "text": "18:30  O Partha, that intellect is born of sattva which understands action and withdrawal, duty and what is not duty, the sources of fear and fearlessness, and bondage and freedom."
    },
    {
      "index": 654,
      "text": "18:31  O Partha, that intellect is born of rajas with which one wrongly understands virtue and vice as also what ought to be done and ought not to be done."
    },
    {
      "index": 655,
      "text": "18:32  O Partha, that intellect is born of tamas which, being covered by darkness, considers vice as virtue, and verily perceives all things contrary to what they are."
    },
    {
      "index": 656,
      "text": "18:33  O Partha, the firmness that is unfailing through concentration, with which one restrains the functions of the mind, vital forces and the organs, that firmness is born of sattva."
    },
    {
      "index": 657,
      "text": "18:34  But, O Partha, the firmness with which one holds on to righteousness, covetable things and wealth, being desirous of their fruits as the occasion for each arises, that firmness is born of rajas."
    },
    {
      "index": 658,
      "text": "18:35  That firmness is considered to be born of tamas due to which a person with a corrupt intellect does not give up sleep, fear, sorrow, despondency as also sensuality."
    },
    {
      "index": 659,
      "text": "18:36  Now hear from Me, O scion of the Bharata dynasty, as regards the three kinds of joy: That in which one delights owing to habit, and certainly attains the cessation of sorrows; That which is like poison in the beginning, but comparable to nectar in the end, and which, arises from the purity of one's intellect-that joy is spoken of as born of sattva."
    },
    {
      "index": 660,
      "text": "18:37  Now hear from Me, O scion of the Bharata dynasty, as regards the three kinds of joy: That in which one delights owing to habit, and certainly attains the cessation of sorrows; That which is like poison in the beginning, but comparable to nectar in the end, and which, arises from the purity of one's intellect-that joy is spoken of as born of sattva."
    },
    {
      "index": 661,
      "text": "18:38  That joy is referred to as born of rajas which, arising from the contact of the organs and (their) objects, is like nectar in the beginning, but like poison at the end."
    },
    {
      "index": 662,
      "text": "18:39  That joy is said to be born of tamas which, both in the beginning and in the end, is delusive to oneself and arises from sleep, laziness and inadvertence."
    },
    {
      "index": 663,
      "text": "18:40  There is no such entity in the world or, again, among the gods in heaven, which can be free from these three gunas born of Nature."
    },
    {
      "index": 664,
      "text": "18:41  O scorcher of enemies, the duties of the Brahmanas, the Ksatriyas and the Vaisyas, as also of the Sudras have been fully classified according to the gunas born from Nature."
    },
    {
      "index": 665,
      "text": "18:42  The natural duties of the Brahmanas are the control of the internal and external organs, austerity, purity, forgiveness, straightforwardness, knowledge as also wisdom [Knowledge refers to the understanding of subjects presented by the scriptures; wisdom means making them matters of one's own experience.] and faith."
    },
    {
      "index": 666,
      "text": "18:43  The natural duties of the Ksatriyas are heroism, boldness, fortitude, capability, and also not retreating from battle, generosity and lordliness."
    },
    {
      "index": 667,
      "text": "18:44  The natural duties of the Vaisyas are agriculture, cattle-rearing and trade. Of the Sudras, too, the natural duty is in the form of service."
    },
    {
      "index": 668,
      "text": "18:45  Being devoted to his own duty, man attains complete success. Hear that as to how one devoted to his own duty achieves success."
    },
    {
      "index": 669,
      "text": "18:46  A human being achieves success by adoring through his own duties Him from whom is the origin of creatures, and by whom is all this pervaded."
    },
    {
      "index": 670,
      "text": "18:47  One's own duty, (though) defective, is superior to another's duty well performed. By performing a duty as dictated by one's own nature, one does not incur sin."
    },
    {
      "index": 671,
      "text": "18:48  O son of Kunti, one should not give up the duty to which one is born, even though it be faulty. For all undertakings are surrounded with evil, as fire is with smoke."
    },
    {
      "index": 672,
      "text": "18:49  He whose intellect remains unattached to everything, who has conquered his internal organs and is desire-less, attains through monasticism the supreme perfection consisting in the state of one free from duties."
    },
    {
      "index": 673,
      "text": "18:50  Understand for certain from Me, in brief indeed, O son of Kunti, that process by which one who has achieved success attains Brahman, which is the supreme consummation of Knowledge."
    },
    {
      "index": 674,
      "text": "18:51  Being endowed with a pure intellect, and controlling oneself with fortitude, rejecting the objects-beginning from sound, and eliminating attachment and hatred;"
    },
    {
      "index": 675,
      "text": "18:52  One who resorts to solitude, eats sparingly, has speech, body and mind under control, to whom meditation and concentration are ever the highest (duty), and who is possessed of dispassion;"
    },
    {
      "index": 676,
      "text": "18:53  (That person,) having discarded egotism, force, pride, desire, anger and superfluous possessions, free from the idea of possession, and serene, is fit for becoming Brahman."
    },
    {
      "index": 677,
      "text": "18:54  One who has become Brahman and has attained the blissful Self does not grieve or desire. Becoming the same towards all beings, he attains supreme devotion to Me."
    },
    {
      "index": 678,
      "text": "18:55  Through devotion he knows Me in reality, as to what and who I am. Then, having known Me in truth, he enters (into Me) immediately after that (Knowledge)."
    },
    {
      "index": 679,
      "text": "18:56  Ever engaging even in all actions, one to whom I am the refuge, attains the eternal, immutable State through My grace."
    },
    {
      "index": 680,
      "text": "18:57  Mentally surrendering all actions to Me and accepting Me as the supreme, have your mind ever fixed on Me by resorting to the concentration of your intellect."
    },
    {
      "index": 681,
      "text": "18:58  Having your mind fixed on Me, you will cross over all difficulties through My grace. If, on the other hand, you do not listen out of egotism, you will get destroyed."
    },
    {
      "index": 682,
      "text": "18:59  That you think 'I shall not fight', by relying on egotism, -vain is this determination of yours. (Your) nature impel you!"
    },
    {
      "index": 683,
      "text": "18:60  Being bound by your own duty born of nature, O son of Kunti, you, being helpless, will verily do that which you do not wish to do owing to indiscrimination."
    },
    {
      "index": 684,
      "text": "18:61  O Arjuna, the Lord resides in the region of the heart of all creatures, revolving through Maya all the creatures (as though) mounted on a machine!"
    },
    {
      "index": 685,
      "text": "18:62  Take refuge in Him alone with your whole being, O scion of the Bharata dynasty. Through His grace you will attain the supreme Peace and the eternal Abode."
    },
    {
      "index": 686,
      "text": "18:63  To you has been imparted by Me this knowledge [Derived in the instrumental sense of 'means of knowledge'; i.e. the scripture Gita.] which is more secret than any secret. Pondering over this as a whole, do as you like."
    },
    {
      "index": 687,
      "text": "18:64  Listen again to My highest utterance which is the profoundest of all. Since you are ever dear to Me, therefore I shall speak what is beneficial to you."
    },
    {
      "index": 688,
      "text": "18:65  Have your mind fixed on Me, be My devotee, be a sacrificer to Me and bow down to Me. (Thus) you will come to Me alone. (This) truth do I promise to you. (For) you are dear to Me."
    },
    {
      "index": 689,
      "text": "18:66  Abandoning all forms of rites and duties, take refuge in Me alone. I shall free you from all sins. (Therefore) do not grieve."
    },
    {
      "index": 690,
      "text": "18:67  This (that I have taught) you should not ever be taught to one who is devoid of austerities and to one who is not a devotee; also, neither to one who does not render service, nor as well to one who cavils at Me."
    },
    {
      "index": 691,
      "text": "18:68  He who, entertaining supreme devotion to Me, will speak of this highest secret, to My devotees will without doubt reach Me alone."
    },
    {
      "index": 692,
      "text": "18:69  And as compared with him, none else among human beings is the best accomplisher of what is dear to Me. Moreover, nor will there be anyone else in the world dearer to Me than he."
    },
    {
      "index": 693,
      "text": "18:70  And he who will study this sacred conversation between us two, which is conducive to virtue, by him I shall be adored through the Sacrifice in the form of Knowledge. This is My judgement."
    },
    {
      "index": 694,
      "text": "18:71  Any man who, being reverential and free from cavilling, might even hear (this), he too, becoming free, shall attain the blessed worlds of those who perform virtuous deeds."
    },
    {
      "index": 695,
      "text": "18:72  O Partha, has this been listened to by you with a one-pointed mind? O Dhananjaya, has your delusion caused by ignorance been destroyed?"
    },
    {
      "index": 696,
      "text": "18:73  Arjuna said: O Acyuta, (my) delusion has been destroyed and memory has been retained by me through Your grace. I stand with my doubt removed; I shall follow Your instruction."
    },
    {
      "index": 697,
      "text": "18:74  Sanjaya said: I thus heard this conversation of Vasudeva and of the great-souled Partha, which is unique and makes one's hair stand on end."
    },
    {
      "index": 698,
      "text": "18:75  Through the favour of Vyasa I heard this secret concerning the supreme Yoga from Krsna, the Lord of yogas, while He Himself was actually speaking!"
    },
    {
      "index": 699,
      "text": "18:76  And, O king, while repeatedly remembering this unique, sacred dialogue between Kesava and Arjuna, I rejoice every moment."
    },
    {
      "index": 700,
      "text": "18:77  O king, repeatedly recollecting that greatly extraordinary form of Hari, I am struck with wonder. And I rejoice again and again."
    },
    {
      "index": 701,
      "text": "18:78  Where there is Krsna, the Lord of yogas, and where there is Partha, the wielder of the bow, there are fortune, victory, prosperity and unfailing prudence. Such is my conviction."
    }
  ];
export const GET = (async () => {
  return json(VERSES);
}) satisfies RequestHandler;