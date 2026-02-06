export type Language = 'ko' | 'en' | 'ja';

export interface Translations {
  // Navigation
  nav: {
    hero: string;
    story: string;
    characters: string;
    registration: string;
    empire: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    scrollHint: string;
    preRegistrations: string;
    counterLabel: string;
  };
  
  // Story Section
  story: {
    title: string;
    subtitle: string;
    chapters: {
      title: string;
      content: string;
    }[];
  };
  
  // Characters Section
  characters: {
    title: string;
    subtitle: string;
    episodes: {
      title: string;
      description: string;
      status: string;
    }[];
    characterNames: string[];
    characterDescriptions: string[];
    abilities: {
      attack: string;
      defense: string;
      speed: string;
    };
    unlockHint: string;
    episodeCard: {
      locked: string;
      newBadge: string;
      textLabel: string;
      audioLabel: string;
    };
    rewards: {
      title: string;
      subtitle: string;
      items: {
        name: string;
        description: string;
      }[];
    };
  };
  
  // Registration Section
  registration: {
    title: string;
    subtitle: string;
    counterLabel: string;
    openModalButton: string;
    policyNotice: string;
      modal: {
        title: string;
        description: string;
        namePlaceholder: string;
        phonePlaceholder: string;
        privacyPolicyLink: string;
        termsLink: string;
        agreementPrefix: string;
        agreementConnector: string;
        agreementSuffix: string;
        processingText: string;
      };
    form: {
      emailLabel: string;
      emailPlaceholder: string;
      nicknameLabel: string;
      nicknamePlaceholder: string;
      submitButton: string;
    };
    benefits: {
      title: string;
      items: string[];
    };
    successMessage: string;
    errorMessage: string;
    emailError: string;
    policyAgreementError: string;
    registrationSuccess: string;
    confirmationEmailSent: string;
  };
  
  // Referral Section
  referral: {
    title: string;
    subtitle: string;
    empireSizeLabel: string;
    inviteLinkLabel: string;
    copyButton: string;
    copyFailed: string;
    shareToast: string;
    rootNickname: string;
    mockFriends: {
      friendA: string;
      friendB: string;
      friendC: string;
      friendA1: string;
      friendA2: string;
      friendB1: string;
    };
    progress: {
      title: string;
      inviteGoal: string;
      completed: string;
      peopleCount: string;
    };
    treeNode: {
      inviteText: string;
      peopleCountUnit: string;
    };
    networkTitle: string;
    networkSubtitle: string;
    totalInvited: string;
    directInvitesLabel: string;
    level1Label: string;
    level2Label: string;
    stats: {
      invited: string;
      rewards: string;
      rank: string;
    };
    shareButton: string;
    linkCopied: string;
    copySuccess: string;
  };
  
  // Footer
  footer: {
    brandDescription: string;
    infoTitle: string;
    socialMediaTitle: string;
    copyright: string;
    poweredBy: string;
    links: {
      privacy: string;
      terms: string;
      contact: string;
    };
    privacyPolicy: string;
    termsOfService: string;
    customerSupport: string;
    faq: string;
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    nav: {
      hero: '홈',
      story: '스토리',
      characters: '캐릭터',
      registration: '사전예약',
      empire: '나의 제국'
    },
    hero: {
      title: 'Realm of Shadows',
      subtitle: '동료를 모으고, 길드를 성장시키고, 제국을 지배하라.|실시간 네트워크 성장 RPG 지금 사전등록하고 창립 보상 받기',
      cta: '지금 사전예약하기',
      scrollHint: '스크롤하여 세계관을 탐험하세요',
      preRegistrations: '사전예약',
      counterLabel: '현재 예약자 수'
    },
    story: {
      title: '그림자의 세계로',
      subtitle: '천년의 봉인이 깨지고, 어둠의 군주가 깨어난다',
      chapters: [
        {
          title: '제1장: 봉인의 파편',
          content: '고대 신전의 봉인이 깨지면서, 잊혀진 어둠의 힘이 다시 세상에 모습을 드러낸다. 당신은 마지막 수호자로서 이 위협에 맞서야 한다.'
        },
        {
          title: '제2장: 그림자 군단',
          content: '어둠의 군주가 이끄는 그림자 군단이 왕국을 침략하기 시작한다. 각 지역의 영웅들을 모으고 연합군을 결성하라.'
        },
        {
          title: '제3장: 잃어버린 유산',
          content: '전설의 무기와 고대 마법을 찾아 떠나는 여정. 금지된 던전 깊숙은 곳에 숨겨진 비밀을 밝혀내라.'
        },
        {
          title: '제4장: 최후의 전투',
          content: '운명의 날이 다가온다. 빛과 어둠의 최종 대결에서 왕국의 미래가 결정된다.'
        }
      ]
    },
    characters: {
      title: '영웅들의 각성',
      subtitle: '사전예약하고 에피소드를 잠금 해제하세요',
      episodes: [
        {
          title: '에피소드 1: 어둠의 기사',
          description: '타락한 성기사 카엘의 복수와 구원 이야기',
          status: '잠금 해제'
        },
        {
          title: '에피소드 2: 혈족의 여왕',
          description: '뱀파이어 여왕 셀레네의 금지된 사랑',
          status: '사전예약 시 해제'
        },
        {
          title: '에피소드 3: 룬의 마법사',
          description: '고대 마법을 다루는 대현자 메르디안',
          status: '친구 3명 초대 시 해제'
        },
        {
          title: '에피소드 4: 그림자 암살자',
          description: '어둠 속의 처형자, 레이븐의 과거',
          status: '친구 5명 초대 시 해제'
        }
      ],
      characterNames: ['어둠의 기사', '혈족의 여왕', '룬의 마법사', '환영의 군주'],
      characterDescriptions: [
        '타락한 힘으로 적을 압도하는 근접 전사',
        '흡혈 능력으로 생명력을 흡수하는 전사',
        '고대 마법으로 전장을 지배하는 마법사',
        '그림자를 다루는 은밀한 암살자'
      ],
      abilities: {
        attack: '공격력',
        defense: '방어력',
        speed: '속도'
      },
      unlockHint: '더 많은 친구를 초대할수록 더 많은 캐릭터 에피소드가 해제됩니다',
      episodeCard: {
        locked: '잠금됨',
        newBadge: 'NEW',
        textLabel: '텍스트',
        audioLabel: '음성'
      },
      rewards: {
        title: '🎁 사전예약 특별 보상',
        subtitle: '사전예약 참여자 전원에게 드리는 특별한 혜택',
        items: [
          { name: '전설 무기', description: '사전예약 시 전설 등급 무기 지급' },
          { name: '프리미엄 재화', description: '다이아몬드 1,000개 + 골드 100,000' },
          { name: '독점 스킨', description: '어둠의 군주 한정판 스킨 세트' }
        ]
      }
    },
    registration: {
      title: '어둠의 전령이 되어라',
      subtitle: '지금 사전예약하고 독점 보상을 받으세요',
      counterLabel: '현재 예약자 수',
      openModalButton: '지금 사전예약하기',
      policyNotice: '사전예약 시 개인정보 처리방침 및 이용약관에 동의하게 됩니다',
      modal: {
        title: '기본 정보 입력',
        description: '사전예약을 위해 기본 정보를 입력해주세요.',
        namePlaceholder: '이름',
        phonePlaceholder: '전화번호 (010-1234-5678)',
        privacyPolicyLink: '개인정보 처리방침',
        termsLink: '이용약관',
        agreementPrefix: '',
        agreementConnector: ' 및 ',
        agreementSuffix: '에 동의합니다',
        processingText: '처리 중...'
      },
      form: {
        emailLabel: '이메일',
        emailPlaceholder: 'your@email.com',
        nicknameLabel: '전사 이름',
        nicknamePlaceholder: '게임 내에서 사용할 이름',
        submitButton: '사전예약 완료'
      },
      benefits: {
        title: '사전예약 특전',
        items: [
          '전설급 무기 "어둠의 송곳니"',
          '독점 스킨 "그림자 군주 세트"',
          '골드 10,000 & 다이아몬드 500',
          '캐릭터 에피소드 2 즉시 해제'
        ]
      },
      successMessage: '사전예약이 완료되었습니다!',
      errorMessage: '오류가 발생했습니다. 다시 시도해주세요.',
      emailError: '유효한 이메일 주소를 입력해주세요.',
      policyAgreementError: '개인정보 처리방침과 이용약관에 동의해야 합니다.',
      registrationSuccess: '사전예약이 성공적으로 완료되었습니다.',
      confirmationEmailSent: '확인 이메일이 발송되었습니다.'
    },
    referral: {
      title: '나의 제국',
      subtitle: '친구를 초대하고 함께 어둠의 군주가 되어라',
      empireSizeLabel: '제국 규모',
      inviteLinkLabel: '나의 초대 링크',
      copyButton: '복사',
      copyFailed: '복사에 실패했습니다',
      shareToast: '으로 공유하기',
      rootNickname: '나',
      mockFriends: {
        friendA: '친구 A',
        friendB: '친구 B',
        friendC: '친구 C',
        friendA1: '친구 A-1',
        friendA2: '친구 A-2',
        friendB1: '친구 B-1'
      },
      progress: {
        title: '다음 잠금 해제까지',
        inviteGoal: '친구 초대',
        completed: '✓ 완료',
        peopleCount: '명'
      },
      treeNode: {
        inviteText: '초대하기',
        peopleCountUnit: '명'
      },
      networkTitle: '나의 초대 네트워크',
      networkSubtitle: '친구를 초대하고 함께 보상을 받으세요',
      totalInvited: '총 초대',
      directInvitesLabel: '내가 직접 초대한 친구',
      level1Label: '1차 초대',
      level2Label: '2차 초대',
      stats: {
        invited: '초대한 친구',
        rewards: '획득한 보상',
        rank: '제국 순위'
      },
      shareButton: '초대 링크 공유',
      linkCopied: '링크가 복사되었습니다!',
      copySuccess: '링크가 복사되었습니다!'
    },
    footer: {
      brandDescription: '어둠 속에서 깨어나는 전설. 당신의 운명이 기다리고 있습니다.',
      infoTitle: '정보',
      socialMediaTitle: '소셜 미디어',
      copyright: '© 2024 Realm of Shadows. All rights reserved.',
      poweredBy: 'Powered by darkness',
      links: {
        privacy: '개인정보처리방침',
        terms: '이용약관',
        contact: '문의하기'
      },
      privacyPolicy: '개인정보처리방침',
      termsOfService: '이용약관',
      customerSupport: '고객 지원',
      faq: '자주 묻는 질문'
    }
  },
  
  en: {
    nav: {
      hero: 'Home',
      story: 'Story',
      characters: 'Characters',
      registration: 'Pre-Register',
      empire: 'My Empire'
    },
    hero: {
      title: 'Realm of Shadows',
      subtitle: 'Gather allies, grow your guild, and dominate the empire.|Real-time Network Growth RPG - Pre-register now for founding rewards',
      cta: 'Pre-Register Now',
      scrollHint: 'Scroll to explore the world',
      preRegistrations: 'Pre-Registrations',
      counterLabel: 'Current Pre-Registrations'
    },
    story: {
      title: 'Into the Realm of Shadows',
      subtitle: 'The millennium seal breaks, and the Dark Lord awakens',
      chapters: [
        {
          title: 'Chapter 1: Shattered Seal',
          content: 'As the ancient temple\'s seal breaks, forgotten dark forces resurface. You are the last guardian who must face this threat.'
        },
        {
          title: 'Chapter 2: Shadow Legion',
          content: 'The Shadow Legion led by the Dark Lord begins invading the kingdom. Gather heroes from each region and form an alliance.'
        },
        {
          title: 'Chapter 3: Lost Legacy',
          content: 'A journey to find legendary weapons and ancient magic. Uncover the secrets hidden deep within forbidden dungeons.'
        },
        {
          title: 'Chapter 4: Final Battle',
          content: 'The day of destiny approaches. The kingdom\'s future will be decided in the ultimate confrontation between light and darkness.'
        }
      ]
    },
    characters: {
      title: 'Awakening of Heroes',
      subtitle: 'Pre-register to unlock episodes',
      episodes: [
        {
          title: 'Episode 1: Dark Knight',
          description: 'The story of fallen paladin Kael\'s revenge and redemption',
          status: 'Unlocked'
        },
        {
          title: 'Episode 2: Blood Queen',
          description: 'Vampire Queen Selene\'s forbidden love',
          status: 'Unlock on Pre-Registration'
        },
        {
          title: 'Episode 3: Rune Mage',
          description: 'Archmage Meridian who wields ancient magic',
          status: 'Unlock with 3 Friend Invites'
        },
        {
          title: 'Episode 4: Shadow Assassin',
          description: 'Raven\'s past, the executioner in darkness',
          status: 'Unlock with 5 Friend Invites'
        }
      ],
      characterNames: ['Dark Knight', 'Blood Queen', 'Rune Mage', 'Phantom Lord'],
      characterDescriptions: [
        'Melee warrior who overwhelms enemies with corrupted power',
        'Warrior who absorbs life force with vampiric abilities',
        'Mage who dominates the battlefield with ancient magic',
        'Stealthy assassin who manipulates shadows'
      ],
      abilities: {
        attack: 'Attack',
        defense: 'Defense',
        speed: 'Speed'
      },
      unlockHint: 'Invite more friends to unlock more character episodes',
      episodeCard: {
        locked: 'Locked',
        newBadge: 'NEW',
        textLabel: 'Text',
        audioLabel: 'Audio'
      },
      rewards: {
        title: '🎁 Pre-Registration Special Rewards',
        subtitle: 'Exclusive benefits for all pre-registration participants',
        items: [
          { name: 'Legendary Weapon', description: 'Legendary grade weapon upon pre-registration' },
          { name: 'Premium Currency', description: '1,000 Diamonds + 100,000 Gold' },
          { name: 'Exclusive Skin', description: 'Dark Lord Limited Edition Skin Set' }
        ]
      }
    },
    registration: {
      title: 'Become a Herald of Darkness',
      subtitle: 'Pre-register now and receive exclusive rewards',
      counterLabel: 'Current Pre-Registrations',
      openModalButton: 'Pre-Register Now',
      policyNotice: 'By pre-registering, you agree to our Privacy Policy and Terms of Service',
      modal: {
        title: 'Enter Your Information',
        description: 'Please enter your information to complete pre-registration.',
        namePlaceholder: 'Name',
        phonePlaceholder: 'Phone Number (010-1234-5678)',
        privacyPolicyLink: 'Privacy Policy',
        termsLink: 'Terms of Service',
        agreementPrefix: 'I agree to the ',
        agreementConnector: ' and ',
        agreementSuffix: '',
        processingText: 'Processing...'
      },
      form: {
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        nicknameLabel: 'Warrior Name',
        nicknamePlaceholder: 'Your in-game name',
        submitButton: 'Complete Pre-Registration'
      },
      benefits: {
        title: 'Pre-Registration Rewards',
        items: [
          'Legendary Weapon "Fangs of Darkness"',
          'Exclusive Skin "Shadow Lord Set"',
          '10,000 Gold & 500 Diamonds',
          'Character Episode 2 Instant Unlock'
        ]
      },
      successMessage: 'Pre-registration completed!',
      errorMessage: 'An error occurred. Please try again.',
      emailError: 'Please enter a valid email address.',
      policyAgreementError: 'You must agree to the Privacy Policy and Terms of Service.',
      registrationSuccess: 'Pre-registration was successfully completed.',
      confirmationEmailSent: 'A confirmation email has been sent.'
    },
    referral: {
      title: 'My Empire',
      subtitle: 'Invite friends and become the Dark Lord together',
      empireSizeLabel: 'Empire Size',
      inviteLinkLabel: 'My Invite Link',
      copyButton: 'Copy',
      copyFailed: 'Failed to copy',
      shareToast: 'Share to ',
      rootNickname: 'You',
      mockFriends: {
        friendA: 'Friend A',
        friendB: 'Friend B',
        friendC: 'Friend C',
        friendA1: 'Friend A-1',
        friendA2: 'Friend A-2',
        friendB1: 'Friend B-1'
      },
      progress: {
        title: 'Next Unlock',
        inviteGoal: 'Invite',
        completed: '✓ Completed',
        peopleCount: ' friends'
      },
      treeNode: {
        inviteText: 'Invite',
        peopleCountUnit: ' people'
      },
      networkTitle: 'My Referral Network',
      networkSubtitle: 'Invite friends and earn rewards together',
      totalInvited: 'Total Invited',
      directInvitesLabel: 'Friends I Invited',
      level1Label: 'Direct Invite',
      level2Label: 'Indirect Invite',
      stats: {
        invited: 'Friends Invited',
        rewards: 'Rewards Earned',
        rank: 'Empire Rank'
      },
      shareButton: 'Share Invite Link',
      linkCopied: 'Link copied!',
      copySuccess: 'Link copied!'
    },
    footer: {
      brandDescription: 'A legend awakens in darkness. Your destiny awaits.',
      infoTitle: 'Information',
      socialMediaTitle: 'Social Media',
      copyright: '© 2024 Realm of Shadows. All rights reserved.',
      poweredBy: 'Powered by darkness',
      links: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact Us'
      },
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      customerSupport: 'Customer Support',
      faq: 'FAQ'
    }
  },
  
  ja: {
    nav: {
      hero: 'ホーム',
      story: 'ストーリー',
      characters: 'キャラクター',
      registration: '事前登録',
      empire: '私の帝国'
    },
    hero: {
      title: 'Realm of Shadows',
      subtitle: '仲間を集め、ギルドを成長させ、帝国を支配せよ。|リアルタイムネットワーク成長RPG 今すぐ事前登録して創立報酬を受け取ろう',
      cta: '今すぐ事前登録',
      scrollHint: 'スクロールして世界を探索',
      preRegistrations: '事前登録',
      counterLabel: '現在の事前登録者数'
    },
    story: {
      title: '影の領域へ',
      subtitle: '千年の封印が解かれ、闇の君主が目覚める',
      chapters: [
        {
          title: '第1章：砕かれた封印',
          content: '古代神殿の封印が解かれ、忘れられた闇の力が再び世界に姿を現す。あなたは最後の守護者として、この脅威に立ち向かわなければならない。'
        },
        {
          title: '第2章：影の軍団',
          content: '闇の君主が率いる影の軍団が王国への侵攻を開始する。各地域の英雄を集め、同盟軍を結成せよ。'
        },
        {
          title: '第3章：失われた遺産',
          content: '伝説の武器と古代魔法を探す旅。禁断のダンジョンの奥深くに隠された秘密を明らかにせよ。'
        },
        {
          title: '第4章：最終決戦',
          content: '運命の日が近づく。光と闇の最終対決で王国の未来が決まる。'
        }
      ]
    },
    characters: {
      title: '英雄たちの覚醒',
      subtitle: '事前登録してエピソードをアンロック',
      episodes: [
        {
          title: 'エピソード1：闇の騎士',
          description: '堕ちた聖騎士カエルの復讐と救済の物語',
          status: 'アンロック済み'
        },
        {
          title: 'エピソード2：血族の女王',
          description: '吸血鬼の女王セレネの禁じられた愛',
          status: '事前登録でアンロック'
        },
        {
          title: 'エピソード3：ルーンの魔法使い',
          description: '古代魔法を操る大賢者メリディアン',
          status: '友達3人招待でアンロック'
        },
        {
          title: 'エピソード4：影の暗殺者',
          description: '闇の処刑人、レイヴンの過去',
          status: '友達5人招待でアンロック'
        }
      ],
      characterNames: ['闇の騎士', '血族の女王', 'ルーンの魔法使い', '幻影の君主'],
      characterDescriptions: [
        '堕落した力で敵を圧倒する近接戦士',
        '吸血能力で生命力を吸収する戦士',
        '古代魔法で戦場を支配する魔法使い',
        '影を操る秘密の暗殺者'
      ],
      abilities: {
        attack: '攻撃力',
        defense: '防御力',
        speed: '速度'
      },
      unlockHint: 'より多くの友達を招待すると、より多くのキャラクターエピソードがアンロックされます',
      episodeCard: {
        locked: 'ロック中',
        newBadge: 'NEW',
        textLabel: 'テキスト',
        audioLabel: '音声'
      },
      rewards: {
        title: '🎁 事前登録特別報酬',
        subtitle: '事前登録参加者全員に提供する特別な特典',
        items: [
          { name: '伝説の武器', description: '事前登録時に伝説級武器を支給' },
          { name: 'プレミアム通貨', description: 'ダイヤモンド1,000個 + ゴールド100,000' },
          { name: '限定スキン', description: '闇の君主限定版スキンセット' }
        ]
      }
    },
    registration: {
      title: '闇の伝令となれ',
      subtitle: '今すぐ事前登録して限定報酬を獲得',
      counterLabel: '現在の事前登録者数',
      openModalButton: '今すぐ事前登録',
      policyNotice: '事前登録時にプライバシーポリシーと利用規約に同意したことになります',
      modal: {
        title: '基本情報入力',
        description: '事前登録のため基本情報を入力してください。',
        namePlaceholder: '名前',
        phonePlaceholder: '電話番号 (010-1234-5678)',
        privacyPolicyLink: 'プライバシーポリシー',
        termsLink: '利用規約',
        agreementPrefix: '',
        agreementConnector: 'および',
        agreementSuffix: 'に同意します',
        processingText: '処理中...'
      },
      form: {
        emailLabel: 'メールアドレス',
        emailPlaceholder: 'your@email.com',
        nicknameLabel: '戦士名',
        nicknamePlaceholder: 'ゲーム内で使用する名前',
        submitButton: '事前登録完了'
      },
      benefits: {
        title: '事前登録特典',
        items: [
          '伝説級武器「闇の牙」',
          '限定スキン「影の君主セット」',
          'ゴールド10,000＆ダイヤモンド500',
          'キャラクターエピソード2即時アンロック'
        ]
      },
      successMessage: '事前登録が完了しました！',
      errorMessage: 'エラーが発生しました。もう一度お試しください。',
      emailError: '有効なメールアドレスを入力してください。',
      policyAgreementError: 'プライバシーポリシーと利用規約に同意する必要があります。',
      registrationSuccess: '事前登録が正常に完了しました。',
      confirmationEmailSent: '確認メールが送信されました。'
    },
    referral: {
      title: '私の帝国',
      subtitle: '友達を招待して一緒に闇の君主になろう',
      empireSizeLabel: '帝国規模',
      inviteLinkLabel: '私の招待リンク',
      copyButton: 'コピー',
      copyFailed: 'コピーに失敗しました',
      shareToast: 'で共有',
      rootNickname: '私',
      mockFriends: {
        friendA: '友達 A',
        friendB: '友達 B',
        friendC: '友達 C',
        friendA1: '友達 A-1',
        friendA2: '友達 A-2',
        friendB1: '友達 B-1'
      },
      progress: {
        title: '次のアンロックまで',
        inviteGoal: '友達招待',
        completed: '✓ 完了',
        peopleCount: '人'
      },
      treeNode: {
        inviteText: '招待する',
        peopleCountUnit: '人'
      },
      networkTitle: '私の招待ネットワーク',
      networkSubtitle: '友達を招待して一緒に報酬を獲得',
      totalInvited: '合計招待',
      directInvitesLabel: '直接招待した友達',
      level1Label: '直接招待',
      level2Label: '間接招待',
      stats: {
        invited: '招待した友達',
        rewards: '獲得した報酬',
        rank: '帝国ランク'
      },
      shareButton: '招待リンクを共有',
      linkCopied: 'リンクがコピーされました！',
      copySuccess: 'リンクがコピーされました！'
    },
    footer: {
      brandDescription: '闇の中で目覚める伝説。あなたの運命が待っています。',
      infoTitle: '情報',
      socialMediaTitle: 'ソーシャルメディア',
      copyright: '© 2024 Realm of Shadows. All rights reserved.',
      poweredBy: 'Powered by darkness',
      links: {
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
        contact: 'お問い合わせ'
      },
      privacyPolicy: 'プライバシーポリシー',
      termsOfService: '利用規約',
      customerSupport: 'カスタマーサポート',
      faq: 'FAQ'
    }
  }
};