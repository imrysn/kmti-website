const jp = {
  // --- NAVIGATION ---
  nav: {
    home: "ホーム",
    services: "サービス",
    projects: "プロジェクト",
    about: "当社について",
    careers: "キャリア",
    contact: "お問い合わせ"
  },

  // --- COMMON ---
  common: {
    contact_us: "お問い合わせ",
    view_projects: "プロジェクトを見る",
    view_project: "プロジェクトを見る",
    learn_more: "詳細はこちら",
    view_more: "詳細を見る",
    chatbot: {
      teaser: "こんにちは！KMTIアシスタントです👋 何かお手伝いしましょうか？"
    }
  },

  // --- HOME PAGE ---
  home: {
    hero: {
      title: "あなたのビジョンを、\n精密に形にします。"
    },
    why_choose: {
      title: "なぜ当社を選ぶのか",
      precision: {
        title: "精密",
        desc: "当社のチームは、高度な設計技術と細部にまで徹底してこだわる姿勢により、すべてのプロジェクトにおいて正確かつ効率的な成果を提供します"
      },
      innovation: {
        title: "イノベーション",
        desc: "最新のツールと技術を駆使し、効率と品質を両立させながら、お客様のアイデアを実現する創造的なエンジニアリングソリューションを提供します。"
      },
      experience: {
        title: "体験",
        desc: "長年にわたる機械設計・製作の専門知識を活かし、確かな知見と真摯な取り組みに基づいた、信頼性の高いソリューションを提供します"
      }
    },
    services: {
      title: "当社のサービス",
      subtitle: "コンセプトから組立まで、包括的なエンジニアリング＆デザインソリューション",
      items: {
        "3d": {
          title: "3Dモデリング",
          desc: "クライアントのデータをもとに高精度な3Dモデルを作成し、設計内容の可視化と潜在的な課題の早期発見を実現します。このプロセスにより、詳細設計へ進む前に確認・修正・検証を効率的に行うことが可能となります。"
        },
        "2d": {
          title: "2D詳細設計",
          desc: "当社の2D詳細設計プロセスでは、すべての寸法・材料・構成部品を明確に定義し、製造に必要な情報を正確に整理します。効率的な生産を実現するための基盤として、高精度な技術図面を作成します。"
        },
        inspection: {
          title: "部品検査",
          desc: "製作された部品について、設計仕様との整合性および精度を確保するため、徹底した検査・品質チェックを実施します。高度な測定機器を用い、組立前の段階で最高水準の品質を保証します"
        },
        assembly: {
          title: "機械組立",
          desc: "信頼できるパートナー企業と連携し、完成した部品および機械の組立サービスを提供しています。精度と効率を追求し、高性能で即使用可能なシステムをお届けすることを目指しています。"
        }
      }
    },
    projects: {
      title: "ビジョンを現実に",
      subtitle: "当社の精密設計が、アイデアを成功するエンジニアリングソリューションへ変える様子をご覧ください",
      items: {
        dedimpler: { title: "デディンプラー＆フェイサー", desc: "チューブやパイプは、フェーシングおよび内外面の面取り加工が必要であり、チューブミルと連動して行うことも、独立して実施することも可能です。", cat: "仕上げ設備" },
        looper: { title: "ルーパーマシン", desc: "水平ルーパーは、ストリップ材を水平回転テーブル上に収納します。設置スペースが確保できる場合、表面を傷つけることなくストリップ材を保管する最も効率的かつ経済的な方法です。", cat: "ルーパー" },
        forming: { title: "成形・サイジングマシンルーパーマシン", desc: "金属を溶接・結合した後、所定の形状の鋼材を作り出すための成形加工が行われます。", cat: "形成" },
        shear: { title: "せん断溶接機", desc: "シャーおよびエンドウェルダーは、各コイルのテールとノーズを切断します。その後、両端を整列させ、材料や板厚に応じてTIG、MIG、またはMAG溶接により接合します。シングルおよびツイントーチタイプの機種が利用可能です。", cat: "ストリップエントリー" },
        table: { title: "仕上げ台", desc: "仕上げラインにおけるトランスファーテーブルの延長。", cat: "移送テーブルライン" },
        line: { title: "フィニッシュライン", desc: "パイプを規定の長さに切断した後、仕上げラインへ送られ、整列・束ねられた状態で出荷準備が行われます。", cat: "フィニッシュライン" },
        milling: { title: "フライス盤切断機", desc: "ミリングカットオフマシンは、2つのミリングソーを用いてパイプや構造用チューブを所定の長さに切断します。切断面は仕上げ加工を不要とする高品質な仕上がりです。", cat: "カットオフ" },
        furnace: { title: "炉", desc: "炉は、大量のガラスを溶融するために使用されます。ガラス表面に炎を当てる加熱と、燃焼空気の再生加熱により熱が供給されます。", cat: "炉" },
        bundling: { title: "バンドリングマシン", desc: "高速チューブ・パイプバンドリング・梱包機は、ミルから直接チューブを受け取り、輸送および安全のために梱包します。", cat: "仕上げ設備" },
        binding: { title: "バインディングマシン", desc: "完成品を出荷準備のために結束するために使用されるバインディングマシン。", cat: "仕上げ設備" },
        horizontal: { title: "水平ルーバーマシン", desc: "水平ルーパーは、ストリップ材を水平回転テーブル上に収納します。設置スペースが確保できる場合、表面を傷つけることなくストリップ材を保管する最も効率的で経済的な方法です", cat: "ルーパー" },
        uncoiler: { title: "アンコイラーマシン", desc: "アンコイラーは、コイルを安全に保持し、ストリップを帯から解きほぐしてストラップ剥離・平坦化装置に供給できるようにします。", cat: "ストリップエントリー" },
        leveler: { title: "レベラーマシン", desc: "平坦化機は、金属ストリップをスループットで平坦化するために使用されます。例として、定尺切断ラインでの使用や、部品用の単枚金属板の平坦化があります。", cat: "ストリップエントリー" }
      }
    },
    cta: {
      title: "次のプロジェクトの構築を始める準備はできていますか？"
    },
    about: {
      title: "当社について",
      desc: "草壁前野テック株式会社は、精密設計・製作・組立を専門とする信頼のエンジニアリングパートナーです。長年の業界経験と、草壁電機株式会社、ネクストエンジニアリング株式会社、前野技研株式会社との強力なパートナーシップを活かし、クライアントのニーズに応じた高品質なエンジニアリングソリューションを提供します。当社の熟練したプロフェッショナルチームは、革新・技術・専門知識を融合させ、アイデアを効率的で信頼性の高い実用的な設計に変換します。正確性、品質、顧客満足へのこだわりを大切にし、精密さをもってお客様のビジョンを形にします。",
      link: "当社について詳しく知る"
    }
  },

  // ... ABOUT PAGE & MODALS ...
  about: {
    hero: {
      title: "当社について",
      subtitle: "精密さによって駆り立てられ、情熱をもって構築された",
      description: "草壁前野テクノロジーズ株式会社では、日本の卓越したエンジニアリング技術とフィリピン人技術者の高い技能を融合させ、信頼性の高い革新的な産業ソリューションを提供しています。"
    },
    company: {
      title: "当社について",
      para1: "草壁電機株式会社、ネクストエンジニアリング株式会社、前野技研株式会社の協力により設立された当社は、長年にわたるエンジニアリング、製作、機械設計の経験を結集しています。",
      para2: "私たちの使命は、設計・試作から製造まで一貫したトータルエンジニアリングソリューションを提供し、取り組むすべてのプロジェクトにおいて高精度と卓越性を実現することです。",
      cta: "私たちのストーリーを探る"
    },
    story: {
      modal_title: "私たちの物語",
      caption: "(写真左より、前野社長、フィリピン経済特区庁デリマ長官、長谷川雅彦取締役)",
      paragraphs: [
        "1916年に神戸で創立された草壁電機株式会社は、1959年にパイプ業界に参入して以来、世界のパイプ製造業界の礎となってきました。パイプミルおよび関連設備の包括的なポートフォリオを有し、完全なパイプミルシステムを一貫して設計・製造できる世界でも数少ないメーカーの一つとして確固たる地位を築いています。徹底した品質管理と継続的な研究開発により、26カ国のパイプメーカーから信頼を獲得し、日本国内で圧倒的な市場シェアを維持しながら、世界中に最先端のソリューションを提供しています。",
        "2001年にフィリピンで設立された前野技研株式会社は、溶融亜鉛メッキ（JIS認定）、製缶、溶接、機械加工、表面処理における豊富な専門知識を有しています。創業者の歯車減速機、製鉄機械、運搬機械、建設機械における数十年の経験を活かし、前野技研は高度な技術を持つエンジニアチームを育成してきました。同社は製造コスト削減にとどまらず、設計支援や試作開発を提供し、お客様に完全な満足をもたらす総合的なソリューションを実現しています。",
        "ネクストエンジニアリング株式会社は、2007年に三菱重工業の戦略的パートナーとして設立され、火力発電所や燃料電池システムなどのエネルギー関連プロジェクトを専門としています。先進的な金属加工・製造設備を有し、ITおよび半導体分野にも事業を拡大しています。2025年4月には西日本設計株式会社と合併し、船舶・プラント・機械設計の能力を大幅に強化し、構想から完成まで完全に統合されたサービスを提供できるようになりました。",
        "KMTIは、草壁電機の精密エンジニアリング技術、前野技研の高品質製造能力、ネクストエンジニアリングの設計から生産までの統合ソリューションという、3つの業界リーダーの融合を体現しています。私たちの使命は、卓越した図面管理と機密保持により、包括的なエンジニアリングサービスを提供することです。2次元図面を高度な3次元モデルに変換することで、生産上の潜在的な問題を早期に発見し、製造ミスを最小限に抑え、コストを大幅に削減します。OEM機械製造への展開を進める中、確実な機密保持契約に裏打ちされた、ソフトウェアからハードウェアまでのシームレスな統合を提供します。革新と顧客中心のソリューションへのコミットメントが、私たちの成功を定義する信頼関係を維持しながら、事業領域を継続的に拡大する原動力となっています。"
      ]
    },
    vision: {
      title: "私たちのビジョン",
      text: "当社は、クライアントに卓越した成果をもたらし、社員が情熱を持ってキャリアを築ける環境を整え、生み出した価値に対する公正な対価を得ることで、世界をリードする機械設計エンジニアリング企業を目指します。"
    },
    mission: {
      title: "私たちの使命",
      text: "当社は、自社に蓄積された豊富な知見と、業界を牽引するパートナー企業（草壁電機、ネクストエンジニアリング、前野技研）の専門技術を高度に融合。そこにフィリピン人エンジニアの叡智と情熱を注ぎ込むことで、高品質な機械設計・製作を通じて世界の産業発展に貢献いたします。"
    },
    management: {
      title: "当社の経営陣",
      description: "当社の中核を支えるのは、豊富な経験と卓越したリーダーシップ、そして情熱を持つプロフェッショナルチームです。彼らは一丸となって業務を効率的に推進し、目標を高い水準で達成することを常に追求しています。",
      see_more: "もっと見る",
      see_less: "もっと少なく",
      roles: {
        accounting: "経理・総務マネージャー",
        eng_mgr: "エンジニアリングマネージャー",
        ceo: "代表取締役社長 / CEO",
        eng_sup: "技術スーパーバイザー",
        eng_tl: "エンジニアリングチームリーダー",
        eng_atl: "エンジニアリングアシスタントチームリーダー",
        it_staff: "エンジニアリング／ITスタッフ",
        staff_so: "エンジニアリングスタッフ／SO",
        staff: "エンジニアリングスタッフ",
        admin_staff: "総務スタッフ",
        driver: "会社運転手",
        utility: "保守・ユーティリティスタッフ"
      }
    },
    people: {
      title: "私たちのチーム",
      subtitle: "私たちのチーム、私たちの強み - 革新の背後には、品質と協力に専念するチームがあります。"
    },
    history: {
      title: "会社沿革",
      milestones: {
        item1: { year: "2014年10月", title: "設立", description: "フィリピンのカビテにKMTIを設立し、エンジニアリングの基礎を築きました。" },
        item2: { year: "2014", title: "戦略的パートナーシップ", description: "株式会社クサカベ電機（KEMCO）と重要なパートナーシップを締結しました。" },
        item3: { year: "2014", title: "国際従業員交流プログラム", description: "日本のパートナー企業に熟練エンジニアを数ヶ月間派遣し、実地研修と協力を行う従業員派遣プログラムを開始しました。" },
        item4: { year: "2024", title: "新たな提携", description: "技術力を広げるためにNEXT ENGINEERING株式会社と提携しました。" },
        item5: { year: "2025", title: "チーム成長と育成", description: "エンジニアリングチームを拡大し、継続的な研修と育成プログラムを通じて技術的専門知識を強化しました。" }
      }
    },
    related: {
      title: "関連会社",
      kemco: "草壁電機株式会社は、1916年に設立され、1959年よりチューブおよびパイプ産業に参入しました。チューブおよびパイプ産業のあらゆる分野に対応する、フルラインのチューブ・パイプミルおよび関連設備を提供しています。長年にわたる豊富な経験とノウハウ、革新的な設計チーム、そして製造・設置チームの高品質な技術力が結集し、草壁は業界をリードする独創的なチューブ・パイプミルおよび関連設備のサプライヤーとして高い評価を得ています。",
      nexteng: "ネクストエンジニアリング株式会社は、2007年に三菱重工業のパートナーとして設立されました。同社は、火力発電所や燃料電池システムなどのエネルギー関連プロジェクトを手掛けるとともに、自社施設での金属加工・製造を行っています。近年では、ITおよび半導体分野にも事業を拡大しています。2025年4月には、西日本設計株式会社と合併し、船舶・プラント・機械設計の能力を強化するとともに、設計から製造までを一貫して提供できる体制を実現します。",
      mgk: "MGKは、フィリピン人技術者の高い技能を活かした製作を専門としています。溶接技術および各種機械を用いて製品を製造し、完成した構造物には溶融亜鉛めっきを施すことで、長寿命という優れた特長を実現しています。これらの品質は、お客様の満足と信頼を保証するものです。また、企業理念の一環として、本分野における技術・ノウハウの継承を通じて、次世代のフィリピン人技術者を育成し、国際的に競争力のある人材の創出に取り組んでいます。"
    },
    cta: {
      title: "共にイノベーションを創り上げる。"
    }
  },

  // ... SERVICES PAGE & MODALS ...
  services: {
    hero: {
      title: "当社のサービス",
      subtitle: "コンセプトから組立まで、包括的なエンジニアリング＆デザインソリューション",
      cta: "当社の専門知識を探る"
    },
    back_to_services: "← サービス一覧に戻る",
    zoom_instruction: "スクロールでズーム • ドラッグでパン",

    modal: {
      detailed_desc: {
        "3d": "お客様の3Dモデルを変換することで、発生する可能性のある不具合や干渉を容易に確認できます。本プロセスでは、設計内容の修正が必要な場合、随時お客様と協議を行います。3Dモデル完成後は、確認用としてお客様に提出し、承認をいただいたうえで2D詳細設計へ進みます。その後もご要望や修正点がある場合は、2D詳細設計が最終確定するまで設計を調整します",
        "2d": "詳細設計は設計プロセスにおいて極めて重要な工程であり、製作方法、使用材料、寸法、ならびに各種重要な指示に関するほぼすべての情報がこの段階に集約されます。当社は、効率的なワークフローを実現するとともに、細部にまで徹底して配慮し、品質と納期の両面で優れた設計を提供します。また、プロジェクトの各段階で綿密な協議を行い、お客様が常にプロセスに関与できる体制を整えることで、認識の相違による手戻りを防ぎ、計画どおりの進行を重視しています。",
        "inspection": "設計に基づく製作部品の品質検査を強力にサポートします。 製作された部品は、高度な測定機器を用いた厳格な試験・検査を経て、あらゆる項目において高精度かつ高品質であることを担保いたします。 また、当社スタッフが自ら検査現場へ赴き、設計図面と実物との整合性を直接確認。徹底した品質管理体制により、次工程の組立作業へ万全な状態で引き継ぎます。",
        "assembly": "草壁電機株式会社、ネクストエンジニアリング株式会社、前野技研株式会社といった業界を代表する先駆的企業と提携。 高品質かつ高性能なプロダクトの提供により、お客様の生産性向上に寄与し、持続的な事業展開を足元から支えます。"
      },
      "2d_section": {
        s2: { title: "2D 詳細", desc: "" },
        s3: { title: "品質検査", desc: "詳細設計完了後、設計の精度を確保し、エラーの発生を限りなくゼロに近づけるため、複数回にわたるチェックおよび修正を行います。すべての確認が完了し最終確定した段階で、お客様に提出し、最終承認をいただきます。" },
        s4: { title: "設計資格", desc: "ニーズに合わせた柔軟な設計変更 ご要望や状況の変化に応じ、お客様の期待する成果を最大限に引き出すための設計修正を迅速に行います。" }
      }
    },
    items: {
      "3d": {
        title: "3Dモデリング",
        short_desc: "高精度な設計と可視化のために、詳細な3Dモデルを作成し、正確な製作および組立を保証します。",
        detailed_desc: "お客様の3Dモデルを変換することで、発生する可能性のある不具合や干渉を容易に確認できます。本プロセスでは、設計内容の修正が必要な場合、随時お客様と協議を行います。3Dモデル完成後は、確認用としてお客様に提出し、承認をいただいたうえで2D詳細設計へ進みます。その後もご要望や修正点がある場合は、2D詳細設計が最終確定するまで設計を調整します。",
        section_title: "3Dモデリング"
      },
      "2d": {
        title: "2D詳細設計",
        short_desc: "当社の2D詳細設計サービスでは、3Dモデルを精密な図面に変換し、製造と品質検査に備えます。",
        detailed_desc: "詳細設計は設計プロセスにおいて極めて重要な工程であり、製作方法、使用材料、寸法、ならびに各種重要な指示に関するほぼすべての情報がこの段階に集約されます。当社は、効率的なワークフローを実現するとともに、細部にまで徹底して配慮し、品質と納期の両面で優れた設計を提供します。また、プロジェクトの各段階で綿密な協議を行い、お客様が常にプロセスに関与できる体制を整えることで、認識の相違による手戻りを防ぎ、計画どおりの進行を重視しています。",
        section_titles: {
          detail: "2D 詳細",
          checking: "品質検査",
          qualifications: "設計資格"
        },
        section_desc: {
          checking: "詳細設計完了後、設計の精度を確保し、エラーの発生を限りなくゼロに近づけるため、複数回にわたるチェックおよび修正を行います。すべての確認が完了し最終確定した段階で、お客様に提出し、最終承認をいただきます。",
          qualifications: "ニーズに合わせた柔軟な設計変更 ご要望や状況の変化に応じ、お客様の期待する成果を最大限に引き出すための設計修正を迅速に行います。"
        }
      },
      inspection: {
        title: "部品検査",
        short_desc: "精密測定機器と3Dスキャナーを用いた部品検査を実施し、寸法精度を保証します。",
        detailed_desc: "設計に基づく製作部品の品質検査を強力にサポートします。 製作された部品は、高度な測定機器を用いた厳格な試験・検査を経て、あらゆる項目において高精度かつ高品質であることを担保いたします。 また、当社スタッフが自ら検査現場へ赴き、設計図面と実物との整合性を直接確認。徹底した品質管理体制により、次工程の組立作業へ万全な状態で引き継ぎます。"
      },
      assembly: {
        title: "機械組立",
        short_desc: "部品の統合から機械全体の組立に至るまで、当社は機械システムが産業基準を満たすことを確実にします。",
        detailed_desc: "草壁電機株式会社、ネクストエンジニアリング株式会社、前野技研株式会社といった業界を代表する先駆的企業と提携。 高品質かつ高性能なプロダクトの提供により、お客様の生産性向上に寄与し、持続的な事業展開を足元から支えます。"
      }
    },
    workflow: {
      title: "実際の生産フロー",
      steps: {
        inquiry: "オーダーシートによるお問い合わせ",
        reference: "参考データ",
        modeling: "3Dモデリング・修正",
        detailing: "2Dモデリング",
        design: "製造設計",
        fabrication: "製作 / 組立",
        delivery: "製品の納品"
      }
    },
    footer_cta: {
      title: "プロジェクトのご相談はこちらから。お客様の想いを形にする方法を、共に検討しましょう。"
    }
  },

  // ... PROJECTS PAGE AND MODALS ...
  projects: {
    hero: {
      title: "当社のプロジェクト",
      subtitle: "最新の3Dモデルをご覧ください。精密さ、革新性、機能性を兼ね備えて設計されています。"
    },
    grid: {
      description: "以下のプロジェクトカードをクリックすると、詳細情報、3Dモデル、仕様をインタラクティブなモーダルで表示できます。"
    },
    cta: {
      title: "当社のエンジニアリングソリューションにご興味をお持ちですか？"
    },
    modal: {
      view_3d: "3Dモデルを表示",
      labels: {
        desc: "説明：",
        app: "用途：",
        adv: "特長：",
        spec: "仕様："
      }
    },
    modal_items: {
      dedimpler: {
        title: "デディンプラー＆フェイサー",
        category: "機械設備 > チューブ",
        description: "チューブおよびパイプは、フェーシングおよび内外面の面取り加工が必要であり、チューブミルと連動して行うことも、独立して実施することも可能です。",
        application: "単一切断シャー後にチューブの端部を修正する必要があり、フェーシングや面取りが顧客の要望である場合に対応します。",
        advantages: "ミルと連動したデディンプル加工により、在庫保管量を削減し、床面積・人件費・資本の効率的な活用を実現します。"
      },
      bundling: {
        title: "バンドリングマシン",
        category: "機械設備 > チューブ",
        description: "高速チューブ・パイプのバンドリングおよびストラッピングマシンは、ミルから直接チューブを受け取り、そのまま輸送・保管に適した状態で梱包します。梱包前にチューブを大量に保管する必要はありません。",
        application: "",
        advantages: "バンドリングはミルと連動して行われるため、梱包待ちのチューブを大量に保管する必要はありません。在庫保管を最小限に抑え、見た目の美しいプロフェッショナルなバンドルを実現します。静音でのバンドリングが可能です。"
      },
      binding: {
        title: "バインディングマシン",
        category: "機械設備 > チューブ",
        description: "バインディングマシンは、完成品を配送準備として結束するために使用されます。",
        application: "",
        advantages: ""
      },
      looper: {
        title: "ルーパーマシン",
        category: "機械設備 > チューブ",
        description: "水平ルーパーは、ストリップ材を水平回転テーブル上に収納します。設置スペースが確保できる場合、表面を傷つけることなくストリップ材を保管する最も効率的で経済的な方法です",
        application: "すべてのチューブサイズおよび材料に対応可能",
        advantages: "生産性向上、稼働停止時間の短縮、スクラップ削減、ストリップ材の損傷低減"
      },
      horizontal: {
        title: "水平ルーバーマシン",
        category: "機械設備 > チューブ",
        description: "水平ルーパーは、ストリップ材を水平回転テーブル上に収納します。設置スペースが確保できる場合、表面を傷つけることなくストリップ材を保管する最も効率的で経済的な方法です",
        application: "すべてのチューブサイズおよび材料に対応可能",
        advantages: "生産性向上、稼働停止時間の短縮、スクラップ削減、ストリップ材の損傷低減"
      },
      forming: {
        title: "成形・寸法調整マシン",
        category: "機械設備 > チューブ",
        description: "金属帯を溶接・結合した後、所定の形状の鋼材を製造するために成形工程を経ます。"
      },
      shear: {
        title: "シャーウェルダーマシン",
        category: "機械設備 > チューブ",
        description: "せん断・端部溶接機は、あらゆるチューブ・パイプ製造ラインに対応しています。小型のアルミニウム製造ラインから、大型のAPI製造ラインまで幅広く適用可能です。",
        application: "せん断・端部溶接機は、あらゆるチューブ・パイプ製造ラインに対応しています。小型のアルミニウム製造ラインから、大型のAPI製造ラインまで幅広く適用可能です。",
        advantages: "高品質な溶接と安定したサイクルタイムにより、生産性が向上し、スクラップの削減につながります。",
        specification: "小型の半導体向けシステムから大型の全自動システムまで、幅広いせん断・溶接機を提供可能です。"
      },
      uncoiler: {
        title: "アンコイラーマシン",
        category: "機械設備 > チューブ",
        description: "アンコイラーは、コイルを安全に保持し、ストリップを帯から解きほぐしてストラップ剥離・平坦化装置に供給できるようにします。高い生産性が求められる場合は両面アンコイラーが使用されますが、保管スペースや時間に余裕がある場合は片面アンコイラーも使用可能です。",
        application: "垂直型および水平型アンコイラーは、ほとんどの用途に対応しています。例：ERW、TIG、レーザー溶接で使用される鋼、鋼合金、ステンレス鋼、銅、銅合金、アルミニウムなどです。その他の用途や材料向けのアンコイラーも、ご要望に応じて提供可能です。",
        advantages: "重量物の取り扱いはすべて機械で安全に行われます。材料の損傷を抑えつつ、安定したサイクルタイムで迅速な作業が可能です。"
      },
      leveler: {
        title: "レベラーマシン",
        category: "機械設備 > チューブ",
        description: "平坦化機は、金属ストリップをスループットで平坦化するために使用されます。例として、定尺切断ラインでの使用や、部品用の単枚金属板の平坦化があります。",
        application: "",
        advantages: ""
      },
      transfer_table: {
        title: "トランスファーテーブル",
        category: "仕上げテーブル",
        description: "仕上げライン用トランスファーテーブルの延長装置。"
      },
      bundle: {
        title: "バンドルセパレーター",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      pipe_drying: {
        title: "パイプ乾燥工程",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      pipe_bundling: {
        title: "パイプバンドリング",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      product: {
        title: "製品機械設備 > チューブ（サブマシン）保管",
        category: "",
        description: ""
      },
      transfer: {
        title: "トランスファーテーブル",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      finishing: {
        title: "仕上げライン",
        category: "ランアウト、トランスポートテーブル、デディンプラー＆フェイサー、バンドリングマシン",
        description: "パイプを定尺に切断した後、仕上げラインへ送られ、整列・束ねられて出荷準備が行われます。"
      },
      air_blow: {
        title: "エアブロー",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      transfertable_lifter: {
        title: "トランスファーテーブル（リフター）",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      dedimpler_facer: {
        title: "デディンプラー＆フェイサー",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      bunding_machine: {
        title: "バンドリングマシン",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      product_storage: {
        title: "製品保管",
        category: "機械設備 > チューブ（サブマシン）",
        description: ""
      },
      cutoff: {
        title: "ミリングカットオフマシン",
        category: "カットオフ",
        description: "切断盤は2枚の切断鋸を用いて、パイプ及び構造用形鋼を所定の長さに切断します。切断面は面取り加工が不要な仕上げとなります。",
        application: "二次加工なしでチューブにきれいな直角カットを実現するのに最適です。"
      },
      furnace: {
        title: "炉",
        category: "炉",
        description: "炉は、大量のガラスを溶融するために使用されます。ガラス表面に炎をあてて加熱し、燃焼空気の再生加熱も行います。"
      }
    },
    viewer: {
      subtitle_interactive: "インタラクティブ3Dモデルビューアー",
      subtitle_standard: "3Dモデルビューアー",
      unavailable_title: "3Dモデルビューアーはご利用いただけません",
      unavailable_text: "この機械の3Dモデルは現在準備中です。まもなく公開されますので、お楽しみに！",
      camera: {
        isometric: "アイソメトリック",
        isometric_title: "アイソメトリックビュー",
        front: "正面",
        front_title: "正面図",
        back: "背面",
        back_title: "背面図",
        left: "左側",
        left_title: "左側面図",
        right: "右側",
        right_title: "右側面図",
        top: "上面",
        top_title: "上面図",
        bottom: "下面",
        bottom_title: "下面図"
      },
      controls: {
        rotate: "ドラッグで回転",
        zoom: "スクロールで拡大縮小",
        pan: "右クリックでパン"
      }
    }
  },

  // ... CAREERS PAGE ...
  careers: {
    hero: {
      title: "私たちと共に未来を築きましょう",
      description1: "情熱的なイノベーターのチームに参加し、実際に成果を生み出す技術を共に創りましょう。",
      description2: "当社のビジョンである「卓越した製品を創造する」を共有できる才能ある方を募集しています。",
      cta_positions: "募集職種を見る"
    },
    positions: {
      title: "募集職種",
      subtitle: "次のキャリアチャンスを見つけ、私たちと一緒に素晴らしいものを創り上げましょう。",
      apply_btn: "今すぐ応募する",
      eng: {
        title: "エンジニアリングスタッフ / CADオペレーター",
        location: "カビテ州ダスマリニャス市",
        type: "フルタイム",
        desc: "iCADを用いた2D・3D図面作成の専門知識を活かし、当社エンジニアリングチームの一員として活躍しませんか。リーダーシップとチームワークに優れ、数学的知識を有し、最小限の指示のもとでも学ぶ意欲を持って主体的に業務に取り組める方を募集しています。",
        requirements: [
          "男性・女性、18歳以上",
          "AutoCAD、SolidWorks、iCADの知識（2D・3D図面作成）",
          "関連する数学の知識があること",
          "高いリーダーシップ能力およびチームワークスキル",
          "細部への注意力と高い精度"
        ],
        skills: ["AutoCAD", "SolidWorks", "iCAD", "2D詳細設計", "3D図面作成", "数学"],
        courses: ["機械工学", "土木工学", "建築学", "実務研修（On-the-Job Training）", "工業工学",]
      },
      admin: {
        title: "経理・事務スタッフ",
        location: "カビテ州ダスマリニャス市",
        type: "フルタイム",
        desc: "総務・管理部門の円滑な運営をサポートし、多岐にわたる事務・管理業務を遂行します。 採用面では、企画立案から入社に至るまでの一連のプロセスを主導。また、給与計算や福利厚生の管理に加え、フィリピン労働雇用省（DOLE）への月次・年次報告書の作成・提出など、コンプライアンスに基づいた適正な労務管理を徹底しています。",
        requirements: [
          "コンピュータリテラシーがある",
          "優れたコミュニケーション能力（口頭および文書）",
          "強い意志と前向きな仕事への姿勢",
          "結果志向で、プレッシャー下でも業務を遂行できること",
          "優れた時間管理能力とマルチタスク能力",
          "新卒の応募も歓迎",
          "会計原則の知識",
          "DOLE報告の経験があると尚可"
        ],
        courses: ["人材開発・マネジメント", "人材開発・マネジメント経営学士（BBA）", "会計学", "マネジメント",]
      }
    },
    why_work: {
      title: "私たちと働く理由",
      subtitle: "当社は、チームメンバーが最高のパフォーマンスを発揮できるよう、働きやすい環境づくりに注力しています。",
      benefits: {
        insurance: { title: "医療保険", desc: "正社員向けの医療保険は100%会社負担" },
        gov: { title: "法定福利厚生", desc: "SSS、Pag-IBIG、PhilHealthを含む法定福利厚生を完備" },
        thirteenth: { title: "13か月分給与", desc: "フィリピン労働法に基づく13か月分給与を保証" },
        allowance: { title: "各種手当", desc: "正社員向けの交通費、食事手当、制服手当、米の補助金を支給" },
        career: { title: "長期的なキャリア形成", desc: "安定した雇用と長期的な専門的成長の機会" }
      }
    },
    team: {
      title: "チーム紹介",
      description: "私たちは、多様なバックグラウンドを持つクリエイター、思考者、問題解決者のチームです。各プロジェクトに対して、異なる視点や経験、専門知識を活かして取り組んでいます。",
      list: {
        item1: "協力的で包摂的な職場環境",
        item2: "成長と学びの機会",
        item3: "実際に影響を与える意義あるプロジェクトに携われる"
      },
      cta: "当社について詳しく知る"
    },
    apply: {
      title: "応募方法",
      subtitle: "KMTIでエンジニアリングキャリアをスタートする準備はできましたか？以下の方法でご応募ください",
      visit: {
        title: "オフィスのご案内",
        text: "履歴書を直接KMTIオフィスにご提出ください：",
        address: {
          line1: "Team Quest Building, FCIE,",
          line2: "Langkaan, ダスマリニャス市, カビテ州",
          line3: "(PLDT近く)"
        },
        person: "担当者"
      },
      contact: {
        title: "お問い合わせ",
        phone_label: "電話番号",
        email_label: "メールアドレス"
      }
    },
    ready: {
      title: "私たちと一緒に働く準備はできましたか？",
      description: "当社では、さらなる成長に向けて優れたエンジニアリング人材を常に求めています。 現在募集中の職種にお客様のご経験が直接合致しない場合でも、お持ちの特別なスキルや情熱について、ぜひお聞かせください。あなたの強みを活かせる可能性を共に検討しましょう。",
      Linkedin: "リンクトインを訪問",
      facebook: "フェイスブックを訪問"
    },
    card: {
      fulltime_badge: "フルタイム",
      requirements_title: "主な要件:",
      courses_title: "推奨コース:"
    }
  },

  legal: {
    page_title: "法務・コンプライアンス",
    privacy: {
      title: "プライバシーポリシー",
      intro: "株式会社草壁・前野テック（KMTI）は、お客様のプライバシーを尊重し、個人情報の保護に取り組んでいます。",
      collection: "お問い合わせフォームへの入力や求人への応募など、お客様から直接提供された情報を収集します。",
      usage: "収集した情報は、お問い合わせへの回答や応募手続きのために使用します。"
    },
    terms: {
      title: "利用規約",
      intro: "当ウェブサイトにアクセスすることにより、これらの利用規約に拘束されることに同意したものとみなされます。",
      use_license: "KMTIのウェブサイト上の資料のコピー1部を、個人的かつ非営利的な一時的閲覧のためにのみ一時的にダウンロードする許可が与えられます。",
      disclaimer: "KMTIのウェブサイト上の資料は「現状有姿」で提供されます。"
    },
    compliance: {
      title: "コンプライアンスと認証",
      intro: "KMTIは、フィリピンの関連するすべての法律および規制を遵守しています。",
      certifications: "私たちは、最高水準の誠実さと専門的な行動を維持することに取り組んでいます。"
    }
  },

  // ... contact us page ...
  contact: {
    hero: {
      title: "サポートが必要ですか、それとも特定のご質問がありますか？",
      description: "当社のサービス、ビジネスに関するお問い合わせ、または採用に関するご質問など、以下の方法で直接チームにご連絡いただけます。",
    },
    options: {
      email: { title: "一般お問い合わせ", btn: "メールを送信" },
      career: { title: "採用応募", desc: "LinkedInから応募", btn: "採用情報を見る" },
      visit: { title: "オフィス訪問", desc: "地図・アクセスを見る", btn: "Googleマップで開く" }
    },
    divider: { text: "または", desc: "いつでもAIアシスタントにチャットでお問い合わせください" },
    chat: {
      title_main: "私たちとチャットしましょう",
      title_highlight: "いつでも",
      description: "当社のAIアシスタントは、機械設計、組立、部品検査などのサービスに関するよくある質問にお答えし、必要に応じてサポートチームへ直接つなぐことも可能です。",
      features: {
        f1: { title: "24/7 即時回答", text: "当社のサービス、キャリア・応募、各種手続きに関するよくある質問に、迅速にお答えします。" },
        f2: { title: "スマートで役立つサポート", text: "当社のAIはKMTIの専門知識をもとに学習しており、正確かつ適切な情報を提供します" },
        f3: { title: "チームへ直接接続", text: "個別のサポートが必要な場合は、Facebook Messenger またはメールでチームと直接チャットしてください。" },
        f4: { title: "応募者向け", text: "採用に関するお問い合わせや応募状況の確認は、当社のFacebookページから、またはLinkedInのキャリアページからご連絡ください。" }
      },
      btn: "今すぐチャットボットを試す"
    },
    form: {
      title: "お問い合わせ",
      name: "お名前",
      email: "メールアドレス",
      subject: "件名",
      message: "メッセージ",
      send: "メッセージを送信"
    },
    info: {
      title: "連絡先情報",
      label_address: "オフィス住所",
      address: "Team Quest Building FCIE, Langkaan, ダスマリニャス市, カビテ州",
      label_phone: "電話番号",
      phone: "(046) 413-4509",
      label_email: "メールアドレス",
      email: "info@kmti.com.ph"
    }
  },

  // ... CHATWITHUSRIGHTCARD ...
  chatbot_card: {
    header: {
      name: "KMTI ボットアシスタント",
      status: "オンライン"
    },
    body: {
      greeting: "こんにちは。KMTI AIアシスタントです 👋 本日はどのようなご用件でしょうか。",
      hr_message: "当社へのご応募にご興味はありますか？Facebookにて人事担当者とチャットでご相談いただけます。",
      fb_btn: "Facebookで私たちとチャットしましょう"
    },
    menu: {
      services: "当社のサービス",
      careers: "採用情報・応募",
      location: "事業所所在地",
      support: "お問い合わせ",
      about: "KMTIについて"
    },
    footer: {
      placeholder: "メッセージを入力..."
    },
    responses: {

      // .. GENERAL FLOW ...
      default: {
        text: "その件について、どうお手伝いできるか分かりません。メインメニューに戻る、最初からやり直す、または担当者と話す、どれがよろしいでしょうか？",
        actionButtons: [
          { id: "def1", text: "🔙 メインメニューに戻る", action: "back", navigateAction: "main-menu" },
          { id: "def2", text: "🔄 最初からやり直す", action: "start-over" },
          { id: "def3", text: "👤 オペレーターと話す", action: "talk-to-human" }
        ]
      },
      "initial-greeting": {
        text: "こんにちは。KMTI AIアシスタントです 👋 本日はどのようなご用件でしょうか。",
        buttons: [
          { id: "ig1", text: "当社のサービス", action: "services" },
          { id: "ig2", text: "採用情報・応募", action: "careers" },
          { id: "ig3", text: "事業所所在地", action: "location" },
          { id: "ig4", text: "お問い合わせ", action: "support" },
          { id: "ig5", text: "KMTIについて", action: "about" }
        ]
      },
      "facebook-teaser": {
        text: "当社への参加に興味がありますか？Facebookで人事チームとチャットしましょう。",
        actionButtons: [
          { id: "ft1", text: "Facebookで私たちとチャットしましょう", action: "facebook" }
        ]
      },
      "main-menu": {
        text: "本日はどのようなご用件でしょうか？",
        buttons: [
          { id: "mm1", text: "当社のサービス", action: "services" },
          { id: "mm2", text: "採用情報・応募", action: "careers" },
          { id: "mm3", text: "事業所所在地", action: "location" },
          { id: "mm4", text: "お問い合わせ", action: "support" },
          { id: "mm5", text: "KMTIについて", action: "about" }
        ],
        actionButtons: [
          { id: "mma1", text: "オペレーターと話す", action: "talk-to-human" },
          { id: "mma2", text: "最初からやり直す", action: "start-over" }
        ]
      },
      "start-over": {
        text: "",
        buttons: [
          { id: "so1", text: "当社のサービス", action: "services" },
          { id: "so2", text: "採用情報・応募", action: "careers" },
          { id: "so3", text: "事業所所在地", action: "location" },
          { id: "so4", text: "お問い合わせ", action: "support" },
          { id: "so5", text: "KMTIについて", action: "about" }
        ],
        actionButtons: [
          { id: "so6", text: "オペレーターと話す", action: "talk-to-human" }
        ]
      },

      // ... SERVICES BRANCH ...
      services: {
        text: "どのサービスについて詳しく知りたいですか？",
        buttons: [
          { id: "s1", text: "3Dモデリング", action: "3d-modeling" },
          { id: "s2", text: "2D詳細設計", action: "2d-detailing" },
          { id: "s3", text: "部品検査", action: "parts-inspection" },
          { id: "s4", text: "機械組立", action: "machine-assembly" },
          { id: "s5", text: "メインメニューに戻る", action: "main-menu" }
        ]
      },
      "3d-modeling": {
        text: "当社の3Dモデリングサービスは、高精度なエンジニアリングと可視化のための詳細なモデルを作成し、正確な製造と組立を保証します。当社のプロジェクトについて詳しく知りたいですか？",
        buttons: [
          { id: "3d1", text: "詳細を見る", action: "learn-more-3d" },
          { id: "3d2", text: "サービスに戻る", action: "services" }
        ]
      },
      "2d-detailing": {
        text: "当社の2D詳細設計は、3Dモデルを精密な製造図面および品質検査文書に変換します。",
        buttons: [
          { id: "2d1", text: "詳細を見る", action: "learn-more-2d" },
          { id: "2d2", text: "サービス一覧に戻る", action: "services" }
        ]
      },
      "parts-inspection": {
        text: "お客様の設計に基づき、組立前の品質確保のため加工部品を検査します。各部品は高精度測定装置を用いた一連の試験を経て、精度と正確性を検証します。",
        buttons: [
          { id: "pi1", text: "詳細を見る", action: "learn-more-inspection" },
          { id: "pi2", text: "サービス一覧に戻る", action: "services" }
        ]
      },
      "machine-assembly": {
        text: "業界のパイオニアである日下部電機機械株式会社、ネクストエンジニアリング、および前野技研株式会社との連携により、効率性と長期的な成功を追求した高性能製品をお客様に提供します。",
        buttons: [
          { id: "ma1", text: "詳細を見る", action: "learn-more-assembly" },
          { id: "ma2", text: "サービス一覧に戻る", action: "services" }
        ]
      },

      // ... CAREERS BRANCH ...
      careers: {
        text: "kMTIへの参加に興味がありますか？私たちは常に、スキルと情熱を持った才能ある人材を求めています。何をお知りになりたいですか？",
        buttons: [
          { id: "c1", text: "募集職種を見る", action: "view-positions" },
          { id: "c2", text: "応募方法", action: "how-to-apply" },
          { id: "c3", text: "採用プロセス", action: "hiring-process" },
          { id: "c4", text: "キャリア機会", action: "career-opportunities" },
          { id: "c5", text: "勤務スケジュール", action: "working-schedule" },
          { id: "c6", text: "人事部へのお問い合わせ", action: "contact-hr" },
          { id: "c7", text: "メインメニューに戻る", action: "main-menu" }
        ]
      },
      "how-to-apply": {
        text: "応募方法は2通りあります：\n 1️⃣当社オフィスに直接履歴書を提出：\n 🏛 チームクエストビル、FCIE、ダスマリナス・カビテ\n 2️⃣LinkedInページからオンライン応募\n 3️⃣より個人的な問い合わせや迅速な対応をご希望の場合は、Facebook Messengerで人事部まで直接メッセージをお送りください",
        actionButtons: [
          { id: "ha1", text: "LinkedIn経由で応募する", action: "apply", url: "https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" },
          { id: "ha2", text: "Facebookで人事部にメッセージを送る", action: "message" },
          { id: "ha3", text: "戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "hiring-process": {
        text: "採用プロセスは、最初の面接から最終評価まで通常1日程度かかります。",
        actionButtons: [
          { id: "hp1", text: "戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "career-opportunities": {
        text: "私たちは継続的な改善を信じています。KMTIにおけるキャリア成長の大きな機会の一つは、技術スキルを磨くために日本で研修を受けるチャンスです。",
        actionButtons: [
          { id: "co1", text: "今すぐ応募する", action: "apply" }
        ]
      },
      "view-positions": {
        text: "現在募集中の職種：\n• エンジニアリングスタッフ ／ CADオペレーター ／ OJT（オン・ザ・ジョブ・トレーニング）\n• 経理 ／ 事務スタッフ\n📍 勤務地：カビテ州ダスマリナス",
        actionButtons: [
          { id: "vp1", text: "今すぐ応募する", action: "apply" }
        ]
      },
      "working-schedule": {
        text: "当社の勤務スケジュールは圧縮勤務制を採用しております：\n勤務日：月曜日から金曜日\n勤務時間：\n• 月曜日から木曜日：午前7時～午後6時\n• 金曜日：午前7時～午後4時 ",
        actionButtons: [
          { id: "ws1", text: "今すぐ応募する", action: "apply" }
        ]
      },
      "contact-hr": {
        text: "当社の人事チームへは下記よりご連絡いただけます：\n💌 info@kmti.com.ph\n☎️ (046)-413-4509\n💬 より迅速な対応をご希望の場合は、Facebook Messengerでメッセージをお送りください。",
        actionButtons: [
          { id: "ch1", text: "✉️ 人事部にメールを送る", action: "email" },
          { id: "ch2", text: "💬 Facebookで人事部にメッセージを送る", action: "message" },
          { id: "ch3", text: "戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "benefits": {
        text: "KMTIは競争力のある報酬と福利厚生を提供しています。内容は以下の通りです：\n• 競争力のある給与\n• 日本での研修機会\n• キャリアの成長と発展\n• 圧縮勤務スケジュール（月～金）\n• 専門能力開発プログラム",
        actionButtons: [
          { id: "ben1", text: "詳細は人事部までお問い合わせください", action: "back", navigateAction: "careers" },
          { id: "ben2", text: "採用情報に戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "application-requirement": {
        text: "要件は職種によって異なりますが、一般的に以下のものが含まれます：\n• 関連する学歴\n• 技術スキル（CAD、エンジニアリング）\n• 学習意欲\n• 細部への注意力\n• チームコラボレーションスキル\n\n詳細な要件については、各職種の詳細をご確認ください！",
        actionButtons: [
          { id: "ar1", text: "🔎 募集職種を見る", action: "back", navigateAction: "view-positions" },
          { id: "ar2", text: "📞 人事部へお電話ください (046) 413-4509", action: "back", navigateAction: "contact-hr" },
          { id: "ar3", text: "採用情報に戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "training": {
        text: "KMTIは優れた研修機会を提供します：• 現場研修• 技術スキルの開発• 継続的な学習と成長• 経験豊富なエンジニアによるメンターシップ",
        actionButtons: [
          { id: "tr1", text: "🚀 キャリア成長について学ぶ ", action: "back", navigateAction: "career-opportunities" },
          { id: "tr2", text: "採用情報に戻る", action: "back", navigateAction: "careers" }
        ]
      },
      "application-status": {
        text: "応募状況を確認するには、当社の人事チームに直接お問い合わせください。担当者が応募状況や今後の手順についてご案内いたします。",
        actionButtons: [
          { id: "as1", text: "✉️ 人事部にメールを送る", action: "email" },
          { id: "as2", text: "💬 Facebookで人事部にメッセージを送る", action: "message" },
          { id: "as3", text: "📞 人事部へお電話ください (046) 413-4509", action: "call" },
          { id: "as4", text: "採用情報に戻る", action: "back", navigateAction: "careers" }
        ]
      },

      //.. CLIENT QUESTIONS BRANCH ...
      pricing: {
        text: "価格および見積もりについては、お客様のプロジェクト要件に基づいたカスタマイズされた見積もりをご提供いたします。正確な見積もりをご希望の場合は、プロジェクトの詳細をお知らせください。",
        actionButtons: [
          { id: "p1", text: "見積もり依頼メール", action: "email" },
          { id: "p2", text: "見積もり依頼メッセージ", action: "message" },
          { id: "p3", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      timeline: {
        text: "プロジェクトのスケジュールは、複雑さと範囲によって異なります。一般的な目安は以下の通りです：\n• 3Dモデリング：1～4週間\n• 2D詳細設計：1～3週間\n• 部品検査：1～2週間\n• 機械組立：2～6週間\n\n具体的なスケジュールについては、プロジェクトの詳細をお知らせの上、お問い合わせください。",
        actionButtons: [
          { id: "tl1", text: "✉️ タイムラインに関するメール", action: "email" },
          { id: "tl3", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      projects: {
        text: "当社の実績をご覧になりませんか？これまでに完成させたプロジェクトには、移送テーブル、仕上げライン、エアブローシステムなどが含まれます。ぜひポートフォリオをご覧ください！",
        buttons: [
          { id: "pr1", text: "プロジェクトへ移動", action: "view-projects" },
          { id: "pr2", text: "メインメニューに戻る", action: "main-menu" }
        ]
      },
      "view-projects": {
        text: "プロジェクトページへご案内します。詳細情報、3Dモデル、仕様書をご覧いただけます。",
        buttons: [
          { id: "vp1", text: "プロジェクトへ移動", action: "view-projects" },
          { id: "vp2", text: "メインメニューに戻る", action: "main-menu" }
        ]
      },
      "go-projects": {
        text: "プロジェクトへリダイレクト中...",
      },
      qualifications: {
        text: "KMTIはエンジニアリングサービスにおいて長年の実績を有しています。当社は日下部電機株式会社、ネクストエンジニアリング株式会社、前野技研株式会社など業界をリードする企業と協業してきました。当社のチームは先進技術を活用し、国際基準に準拠したサービスを提供します。",
        actionButtons: [
          { id: "q1", text: "KMTIについて詳しく知る", action: "back", navigateAction: "about" },
          { id: "q2", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      process: {
        text: "Our process typically involves:\n1️⃣ Consultation & Requirements Gathering\n2️⃣ Design & 3D Modeling\n3️⃣ 2D Detailing & Quality Checking\n4️⃣ Client Review & Modifications\n5️⃣ Final Approval & Delivery\n\nWe keep clients involved at every stage!",
        actionButtons: [
          { id: "proc1", text: "✉️  プロセスについて議論する", action: "email" },
          { id: "proc3", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      requirements: {
        text: "ご依頼の際には、通常以下の情報が必要となります：\n• プロジェクト仕様\n• デザイン要件\n• 材料のご希望\n• スケジュールに関するご要望\n• 予算に関するご検討事項\n\n具体的なご要望についてご相談ください！",
        actionButtons: [
          { id: "req1", text: "✉️ メール要件", action: "email" },
          { id: "req3", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      payment: {
        text: "支払い条件はプロジェクト相談時に協議し、プロジェクトの範囲に基づいてカスタマイズされます。様々な支払い方法に対応し、柔軟な支払いスケジュールを提供可能です。",
        actionButtons: [
          { id: "pay1", text: "💬 支払い情報に関するメール", action: "email" },
          { id: "pay3", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },

      consultation: {
        text: "",
        actionButtons: [
          { id: "con1", text: "💬 Facebook経由でスケジュールする", action: "message" },
          { id: "con2", text: "✉️ 相談用メール", action: "email" },
          { id: "con3", text: "📞 お電話ください (046) 413-4509 ", action: "call" },
          { id: "con4", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },

      // ... MISC BRANCH ...
      location: {
        text: "本社所在地：\n\nVital Industrial Prop. Inc. Bldg. B. Unit 2-B. First Cavite Industrial Estate Langkaan 1. Dasmarinas City, Cavite 4126 Philippines\n道順をご案内しましょうか？",
        actionButtons: [
          { id: "loc1", text: "Googleマップで開く", action: "maps" },
        ]
      },
      support: {
        text: "他に何かお手伝いが必要ですか？以下の件についてはサポートチームに直接お問い合わせください：\n• サービスやプロジェクトに関するお問い合わせ\n• 技術的なサポート\n• 販売に関するお問い合わせ",
        actionButtons: [
          { id: "sup1", text: "メールでお問い合わせ", action: "email" },
          { id: "sup2", text: "Facebookでメッセージを送る", action: "message" },
          { id: "sup3", text: "戻る", action: "back", navigateAction: "main-menu" }
        ]
      },
      about: {
        text: "KMTI（クサカベ・ミーノ・テック株式会社）は、3Dモデリング、2D詳細設計、部品検査、機械組立における革新的なソリューションを提供する主要なエンジニアリングサービス企業です。",
        buttons: [
          { id: "ab1", text: "詳細を見る", action: "learn-more-about" },
          { id: "ab2", text: "🔙 メインメニューに戻る", action: "main-menu" }
        ]
      },

      "learn-more-about": {
        text: "KMTIは、精密かつ卓越した高品質なエンジニアリングソリューションの提供に尽力しています。熟練した専門家チームがお客様と緊密に連携し、プロジェクトが最高水準を満たすことを保証します。",
        buttons: [
          { id: "lma1", text: "🔙 メインメニューに戻る", action: "learn-more-about" }
        ]
      },
      "talk-to-human": {
        text: "喜んで弊社チームをご紹介いたします！ご連絡方法はどちらがよろしいでしょうか？",
        actionButtons: [
          { id: "th1", text: "メールでお問い合わせ", action: "email", url: "mailto:info@kmti.com.ph" },
          { id: "th2", text: "Facebookでメッセージを送る", action: "facebook", url: "https://www.facebook.com/kmti.com.ph/" },
          { id: "th3", text: "お電話ください (046) 413-4509", action: "call" },
          { id: "th4", text: "メインメニューに戻る", action: "back", navigateAction: "main-menu" }
        ]
      },


    }
  },

  // ... FOOTER ...
  footer: {
    description: "3Dモデリング、2D詳細設計、部品検査、そして機械組立設計。確かな技術と明確な使命を持って、イノベーションを牽引します",
    cols: {
      quick_links: "クイックリンク",
      services: "サービス",
      contact: "お問い合わせ"
    },
    links: {
      home: "ホーム",
      services: "サービス",
      projects: "プロジェクト",
      about: "当社について",
      contact: "お問い合わせ",
      careers: "キャリア",
      legal: "法務・コンプライアンス",
      privacy: "プライバシー",
      terms: "利用規約"
    },


    service_items: {
      modeling: "3Dモデリング",
      detailing: "2D詳細設計",
      inspection: "部品検査",
      assembly: "機械組立"
    },
    contact_info: {
      address: "〒4126 フィリピン、カビテ州、ダスマリニャス市、ランカアン1、ファースト・カビテ工業団地、Vital Industrial Prop. Inc. Bldg. B, Unit 2-B"
    },
    bottom: {
      rights: "日下部・前野テクノロジーズ株式会社 全著作権所有",
      since: "年 開設",
      total_visit: "本日の訪問者数",
      today_visit: "本日",
      yesterday_visit: "昨日"
    }
  },

  not_found: {
    title: "ページが見つかりません",
    message: "お探しのページは削除されたか、URLが変更された可能性があります。",
    back_home: "ホームに戻る"
  },

  // ..... SITEMAP PAGE .....
  sitemap: {
    title: "サイトマップ",
    subtitle: "すべてのページを見つけて、ウェブサイトを簡単にナビゲートできます",
    legal_compliance: "法務・コンプライアンス",
    sections: {
      main_pages: "メインページ",
      services: "サービス",
      projects: "プロジェクト",
      company: "会社情報"
    },
    descriptions: {
      home: "当社のエンジニアリングソリューションと専門知識をご覧ください",
      about: "当社の会社、チーム、歴史について学ぶ",
      contact: "当社のチームにお問い合わせください",
      services: "包括的なエンジニアリングサービスをご覧ください",
      projects: "完成したプロジェクトのポートフォリオをご覧ください",
      careers: "当社のチームに参加し、キャリアを築きましょう",
      legal: "プライバシーポリシー、利用規約、コンプライアンス情報"
    }
  }
};

export default jp;
