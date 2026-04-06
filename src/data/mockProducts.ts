import { Product } from '../types'

const productImage = (fileName: string) => `/images/products/${fileName}`

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '몬스테라 델리시오사',
    description: '넓은 잎이 시원한 분위기를 만드는 대표 실내식물',
    detailedDescription:
      '공간에 자연스러운 포인트를 더해주는 인기 식물입니다. 넓게 갈라진 잎이 매력적이며 거실과 스튜디오 어디에 두어도 잘 어울립니다.',
    careInstructions:
      '밝은 간접광에서 잘 자라며 흙이 어느 정도 마르면 물을 주세요. 통풍이 좋은 곳에서 키우면 잎 상태를 건강하게 유지하기 좋습니다.',
    price: 35000,
    stock: 15,
    category: '대형식물',
    image: productImage('monstera-deliciosa.jpg'),
    createdAt: '2026-03-27T09:00:00Z',
  },
  {
    id: '2',
    name: '다육이 세트',
    description: '작은 공간에 놓기 좋은 컴팩트 다육 식물',
    detailedDescription:
      '단단한 잎 라인이 인상적인 소형 다육 식물입니다. 책상, 선반, 창가에 가볍게 두기 좋고 관리도 쉬운 편입니다.',
    careInstructions:
      '햇빛이 잘 드는 곳을 좋아하며 과습에 약합니다. 흙이 충분히 말랐을 때만 물을 주세요.',
    price: 14000,
    stock: 24,
    category: '다육식물',
    image: productImage('daukplant.jpg'),
    createdAt: '2026-03-27T08:00:00Z',
  },
  {
    id: '3',
    name: '산세베리아 로렌티',
    description: '초보자도 편하게 키우는 공기정화 식물',
    detailedDescription:
      '강한 생명력으로 사랑받는 산세베리아입니다. 세로로 곧게 뻗는 잎 덕분에 모던한 공간과 특히 잘 어울립니다.',
    careInstructions:
      '반양지부터 낮은 조도까지 적응력이 좋습니다. 물은 자주 주지 말고 흙이 완전히 말랐을 때 흠뻑 주세요.',
    price: 18000,
    stock: 20,
    category: '공기정화식물',
    image: productImage('sansevieria-laurentii.jpg'),
    createdAt: '2026-03-27T07:00:00Z',
  },
  {
    id: '4',
    name: '떡갈고무나무',
    description: '존재감 있는 큰 잎으로 공간을 채우는 식물',
    detailedDescription:
      '두껍고 넓은 잎이 인상적인 대형 식물입니다. 거실 코너나 카페 같은 넓은 공간에 두면 분위기를 확실하게 살려줍니다.',
    careInstructions:
      '밝은 간접광을 선호하고 겉흙이 마르면 물을 주세요. 잎에 먼지가 쌓이지 않도록 닦아주면 좋습니다.',
    price: 32000,
    stock: 10,
    category: '대형식물',
    image: productImage('fiddle-leaf-fig.jpg'),
    createdAt: '2026-03-26T09:00:00Z',
  },
  {
    id: '5',
    name: '고무나무 버건디',
    description: '짙은 잎색이 세련된 분위기를 만들어주는 식물',
    detailedDescription:
      '광택 있는 짙은 잎이 특징인 고무나무입니다. 모던한 인테리어에 잘 어울리고 공간의 무게감을 잡아줍니다.',
    careInstructions:
      '밝은 곳을 좋아하지만 강한 직사광선은 피해주세요. 겉흙이 마르면 물을 주고 통풍이 잘 되게 관리합니다.',
    price: 29000,
    stock: 13,
    category: '대형식물',
    image: productImage('rubber-plant-burgundy.jpg'),
    createdAt: '2026-03-26T08:00:00Z',
  },
  {
    id: '6',
    name: '스킨답서스 행잉',
    description: '늘어지는 덩굴이 매력적인 공기정화 식물',
    detailedDescription:
      '행잉 화분이나 선반 위에 두면 자연스럽게 흘러내리는 줄기가 예쁜 식물입니다. 실내 적응력이 좋아 어디든 두기 좋습니다.',
    careInstructions:
      '밝은 간접광에서 잘 자라며 겉흙이 마르면 물을 주세요. 줄기가 길어지면 가볍게 정리해도 좋습니다.',
    price: 15000,
    stock: 25,
    category: '공기정화식물',
    image: productImage('pothos-hanging.jpg'),
    createdAt: '2026-03-26T07:00:00Z',
  },
  {
    id: '7',
    name: '스파티필름',
    description: '부드러운 잎과 흰 꽃이 매력적인 공기정화 식물',
    detailedDescription:
      '실내에서 키우기 쉬우면서도 꽃을 즐길 수 있는 식물입니다. 차분하고 깨끗한 분위기를 연출하기 좋습니다.',
    careInstructions:
      '반양지를 좋아하고 흙이 살짝 촉촉하게 유지되면 좋습니다. 물이 너무 오래 고이지 않게 해주세요.',
    price: 20000,
    stock: 19,
    category: '공기정화식물',
    image: productImage('peace-lily.jpg'),
    createdAt: '2026-03-25T09:00:00Z',
  },
  {
    id: '8',
    name: '알로에 베라',
    description: '선명한 잎 라인이 돋보이는 다육 식물',
    detailedDescription:
      '관리 난도가 낮고 깔끔한 외형 덕분에 꾸준히 인기 있는 다육 식물입니다. 햇빛이 드는 공간에 특히 잘 어울립니다.',
    careInstructions:
      '직사광을 어느 정도 견디며 흙이 충분히 마른 뒤 물을 주세요. 배수가 좋은 토양을 추천합니다.',
    price: 13000,
    stock: 28,
    category: '다육식물',
    image: productImage('aloe-vera.jpg'),
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: '9',
    name: '보스턴 고사리',
    description: '풍성한 잎이 부드러운 무드를 만드는 중형 식물',
    detailedDescription:
      '볼륨감 있는 잎이 풍성하게 퍼지는 고사리입니다. 공간을 조금 더 싱그럽고 부드럽게 보이게 만들어줍니다.',
    careInstructions:
      '높은 습도를 선호하며 겉흙이 마르지 않게 관리해 주세요. 직사광선보다는 밝은 간접광이 좋습니다.',
    price: 17000,
    stock: 9,
    category: '중형식물',
    image: productImage('boston-fern.jpg'),
    createdAt: '2026-03-25T07:00:00Z',
  },
  {
    id: '10',
    name: 'ZZ 플랜트',
    description: '물 주기 부담이 적은 인기 중형 식물',
    detailedDescription:
      '낮은 조도에서도 비교적 잘 적응하는 식물이라 초보자에게 특히 잘 맞습니다. 반짝이는 잎이 깔끔한 인상을 줍니다.',
    careInstructions:
      '과습에 주의하고 흙이 충분히 마르면 물을 주세요. 어두운 공간에서도 관리가 비교적 수월합니다.',
    price: 22000,
    stock: 17,
    category: '중형식물',
    image: productImage('zz-plant.jpg'),
    createdAt: '2026-03-24T09:00:00Z',
  },
  {
    id: '11',
    name: '칼라데아 오르비폴리아',
    description: '패턴 있는 잎이 아름다운 감성 식물',
    detailedDescription:
      '은은한 줄무늬가 들어간 넓은 잎이 특징입니다. 침실이나 거실에 포인트 식물로 두기 좋습니다.',
    careInstructions:
      '직사광선은 피하고 공중 습도를 어느 정도 유지해주세요. 흙이 완전히 마르기 전에 물을 주는 편이 좋습니다.',
    price: 26000,
    stock: 12,
    category: '중형식물',
    image: productImage('calathea-orbifolia.jpg'),
    createdAt: '2026-03-24T08:00:00Z',
  },
  {
    id: '12',
    name: '테라코타 원형 화분',
    description: '따뜻한 질감으로 식물을 돋보이게 하는 기본 화분',
    detailedDescription:
      '어떤 식물과도 잘 어울리는 클래식한 테라코타 화분입니다. 자연스러운 색감 덕분에 식물의 초록빛이 더 살아납니다.',
    careInstructions:
      '배수홀 여부를 확인해 사용해주세요. 실내에서 사용할 경우 물받침과 함께 두면 관리가 편합니다.',
    price: 9000,
    stock: 40,
    category: '화분',
    image: productImage('terracotta-round-pot.jpg'),
    createdAt: '2026-03-24T07:00:00Z',
  },
  {
    id: '13',
    name: '필로덴드론 브라질',
    description: '노란 무늬가 포인트인 덩굴형 식물',
    detailedDescription:
      '초록과 라임 컬러가 섞인 잎이 산뜻한 분위기를 만들어줍니다. 선반이나 행잉 화분에 두면 특히 예쁩니다.',
    careInstructions:
      '밝은 간접광을 좋아하며 흙이 마르면 물을 주세요. 줄기가 길어지면 잘라서 수형을 잡을 수 있습니다.',
    price: 19000,
    stock: 21,
    category: '중형식물',
    image: productImage('philodendron-brazil.jpg'),
    createdAt: '2026-03-23T09:00:00Z',
  },
  {
    id: '14',
    name: '호야 카르노사',
    description: '두툼한 잎과 덩굴이 매력적인 중형 식물',
    detailedDescription:
      '왁스처럼 매끈한 잎이 특징이며 밝은 창가에서 키우기 좋습니다. 늘어지는 줄기가 감성적인 분위기를 더합니다.',
    careInstructions:
      '밝은 간접광에서 관리하고 물은 자주 주지 않아도 됩니다. 흙이 거의 말랐을 때 물을 주세요.',
    price: 21000,
    stock: 14,
    category: '중형식물',
    image: productImage('hoya-carnosa.jpg'),
    createdAt: '2026-03-23T08:00:00Z',
  },
  {
    id: '15',
    name: '페페로미아 오브투시폴리아',
    description: '작고 둥근 잎이 귀여운 테이블 식물',
    detailedDescription:
      '책상이나 선반에 놓기 좋은 아담한 사이즈의 식물입니다. 도톰한 잎 덕분에 전체적으로 귀여운 인상을 줍니다.',
    careInstructions:
      '밝은 곳에서 키우되 강한 직사광은 피해주세요. 흙이 마른 뒤에 물을 주는 편이 좋습니다.',
    price: 16000,
    stock: 18,
    category: '중형식물',
    image: productImage('peperomia-obtusifolia.jpg'),
    createdAt: '2026-03-23T07:00:00Z',
  },
  {
    id: '16',
    name: '크라슐라 오바타',
    description: '동글동글한 잎이 귀여운 다육 식물',
    detailedDescription:
      '돈나무로도 잘 알려진 인기 다육 식물입니다. 햇빛을 잘 받으면 잎 가장자리에 은은한 색감이 올라옵니다.',
    careInstructions:
      '햇빛이 잘 드는 곳에서 키우고 물은 흙이 충분히 마른 후 주세요. 겨울철 과습은 특히 주의합니다.',
    price: 15000,
    stock: 23,
    category: '다육식물',
    image: productImage('jade-plant.jpg'),
    createdAt: '2026-03-22T09:00:00Z',
  },
  {
    id: '17',
    name: '에케베리아 로제트',
    description: '꽃처럼 퍼지는 잎이 예쁜 다육 식물',
    detailedDescription:
      '정갈한 로제트 형태가 매력적인 다육 식물입니다. 작은 화분과 잘 어울려 선물용으로도 인기가 많습니다.',
    careInstructions:
      '햇빛이 잘 드는 곳에 두고 물은 아주 드물게 주세요. 통풍이 중요합니다.',
    price: 11000,
    stock: 27,
    category: '다육식물',
    image: productImage('echeveria-rosette.jpg'),
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: '18',
    name: '세덤 믹스',
    description: '다양한 색감이 섞여 즐거운 다육 모음',
    detailedDescription:
      '여러 종류의 세덤을 한 화분에 담아 컬러감이 풍부합니다. 밝은 창가에 놓으면 더 예쁜 색을 보여줍니다.',
    careInstructions:
      '일조량이 풍부한 곳에서 키우고 흙이 바싹 마른 뒤 물을 주세요. 습한 환경은 피해주세요.',
    price: 12000,
    stock: 30,
    category: '다육식물',
    image: productImage('sedum-mix.jpg'),
    createdAt: '2026-03-22T07:00:00Z',
  },
  {
    id: '19',
    name: '드라세나 마지나타',
    description: '슬림한 수형으로 세련된 인상을 주는 식물',
    detailedDescription:
      '길고 가는 잎이 사방으로 퍼지는 형태가 매력적입니다. 공간을 답답하지 않게 꾸미고 싶을 때 잘 어울립니다.',
    careInstructions:
      '밝은 간접광을 선호하며 흙이 마른 후 물을 주세요. 추위에는 약하니 실내 온도를 유지해주세요.',
    price: 27000,
    stock: 11,
    category: '공기정화식물',
    image: productImage('dracaena-marginata.jpg'),
    createdAt: '2026-03-21T09:00:00Z',
  },
  {
    id: '20',
    name: '아레카야자',
    description: '풍성한 잎이 리조트 같은 무드를 만드는 대형 식물',
    detailedDescription:
      '길게 뻗은 야자 잎이 시원한 분위기를 연출하는 식물입니다. 넓은 거실, 쇼룸, 창가 옆에 잘 어울립니다.',
    careInstructions:
      '밝은 간접광과 적당한 습도를 좋아합니다. 겉흙이 마르면 충분히 물을 주되 물이 고이지 않게 해주세요.',
    price: 39000,
    stock: 8,
    category: '대형식물',
    image: productImage('areca-palm.jpg'),
    createdAt: '2026-03-21T08:00:00Z',
  },
  {
    id: '21',
    name: '유칼립투스 폴리안',
    description: '은은한 색감과 향이 매력적인 감성 식물',
    detailedDescription:
      '실버 그린 컬러의 잎이 차분한 무드를 만들어줍니다. 깔끔하고 담백한 인테리어에 특히 잘 어울립니다.',
    careInstructions:
      '햇빛이 잘 드는 밝은 곳을 좋아합니다. 흙이 마르면 물을 주고 통풍이 잘 되게 해주세요.',
    price: 24000,
    stock: 9,
    category: '중형식물',
    image: productImage('eucalyptus-polyan.jpg'),
    createdAt: '2026-03-21T07:00:00Z',
  },
  {
    id: '22',
    name: '아이비 쉘브 포트',
    description: '선반 위에 두기 좋은 늘어지는 공기정화 식물',
    detailedDescription:
      '작고 촘촘한 잎이 부드럽게 늘어지는 아이비입니다. 작은 공간에 싱그러움을 더하기 좋습니다.',
    careInstructions:
      '밝은 간접광과 적당한 습도를 좋아합니다. 흙 표면이 마르면 물을 주세요.',
    price: 14500,
    stock: 20,
    category: '공기정화식물',
    image: productImage('ivy-shelf-pot.jpg'),
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    id: '23',
    name: '안스리움 레드',
    description: '선명한 색감의 꽃이 포인트가 되는 식물',
    detailedDescription:
      '하트 모양의 광택 있는 꽃이 인상적인 식물입니다. 화사한 포인트를 주고 싶을 때 잘 어울립니다.',
    careInstructions:
      '밝은 간접광에서 잘 자라고 흙을 약간 촉촉하게 유지해 주세요. 건조한 바람은 피하는 편이 좋습니다.',
    price: 23000,
    stock: 16,
    category: '중형식물',
    image: productImage('anthurium-red.jpg'),
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: '24',
    name: '디펜바키아 카밀라',
    description: '연한 무늬 잎이 밝은 분위기를 만드는 식물',
    detailedDescription:
      '크림색 무늬가 섞인 넓은 잎이 특징인 식물입니다. 공간을 산뜻하고 부드럽게 보이게 해줍니다.',
    careInstructions:
      '직사광은 피하고 밝은 간접광에서 키워주세요. 흙 겉면이 마르면 물을 주는 정도가 적당합니다.',
    price: 21000,
    stock: 14,
    category: '공기정화식물',
    image: productImage('dieffenbachia-camille.jpg'),
    createdAt: '2026-03-20T07:00:00Z',
  },
  {
    id: '25',
    name: '클래식 세라믹 화분',
    description: '화이트 톤으로 어떤 식물과도 잘 어울리는 화분',
    detailedDescription:
      '군더더기 없는 디자인의 화이트 세라믹 화분입니다. 실내를 깔끔하게 정리된 느낌으로 보여줍니다.',
    careInstructions:
      '실내 사용 시 물받침과 함께 사용하면 편합니다. 배수홀 유무를 확인하고 식물에 맞게 선택해주세요.',
    price: 11000,
    stock: 35,
    category: '화분',
    image: productImage('classic-ceramic-pot.jpg'),
    createdAt: '2026-03-19T09:00:00Z',
  },
  {
    id: '26',
    name: '행잉 바스켓 화분',
    description: '늘어지는 식물과 잘 어울리는 가벼운 화분',
    detailedDescription:
      '행잉 식물을 한층 더 돋보이게 만드는 바스켓형 화분입니다. 벽면이나 창가 연출에 활용하기 좋습니다.',
    careInstructions:
      '걸이 고정 상태를 꼭 확인해 사용해주세요. 물 주는 날에는 흘러내림을 고려해 위치를 조절하면 좋습니다.',
    price: 13000,
    stock: 22,
    category: '화분',
    image: productImage('hanging-basket-pot.jpg'),
    createdAt: '2026-03-19T08:00:00Z',
  },
  {
    id: '27',
    name: '올리브 나무',
    description: '지중해 느낌을 살려주는 감성 대형 식물',
    detailedDescription:
      '은은한 회녹색 잎이 차분한 분위기를 만들어주는 식물입니다. 자연광이 들어오는 공간에 두면 특히 멋스럽습니다.',
    careInstructions:
      '햇빛이 잘 드는 곳에서 키우고 흙이 마르면 충분히 물을 주세요. 통풍이 중요합니다.',
    price: 45000,
    stock: 7,
    category: '대형식물',
    image: productImage('olive-tree.jpg'),
    createdAt: '2026-03-18T09:00:00Z',
  },
  {
    id: '28',
    name: '레몬 사이프러스',
    description: '상쾌한 향과 색감이 매력적인 포인트 식물',
    detailedDescription:
      '밝은 연두색 잎이 경쾌한 분위기를 더해주는 식물입니다. 입구나 창가에 두면 공간이 더 생기 있어 보입니다.',
    careInstructions:
      '밝은 햇빛을 좋아하며 흙이 완전히 마르지 않게 관리해주세요. 건조한 실내에서는 잎 상태를 자주 확인합니다.',
    price: 26000,
    stock: 12,
    category: '중형식물',
    image: productImage('lemon-cypress.jpg'),
    createdAt: '2026-03-18T08:00:00Z',
  },
  {
    id: '29',
    name: '필레아 페페로미오이데스',
    description: '동전처럼 둥근 잎이 귀여운 테이블 식물',
    detailedDescription:
      '귀엽고 단정한 잎 모양 덕분에 작은 공간에 두기 좋은 식물입니다. 북유럽풍 인테리어와도 잘 어울립니다.',
    careInstructions:
      '밝은 간접광을 좋아하고 흙이 마르면 물을 주세요. 화분 방향을 가끔 돌려주면 수형이 고르게 자랍니다.',
    price: 17000,
    stock: 18,
    category: '중형식물',
    image: productImage('philea-pepelo.jpg'),
    createdAt: '2026-03-18T07:00:00Z',
  },
  {
    id: '30',
    name: '세로형 슬릿 화분',
    description: '대형 식물과 잘 어울리는 모던한 디자인 화분',
    detailedDescription:
      '높이감이 있는 디자인으로 대형 식물과 매치하기 좋은 화분입니다. 현관이나 거실 코너를 세련되게 마무리해줍니다.',
    careInstructions:
      '실내용으로 사용할 때는 물받침 또는 이너포트를 함께 사용해주세요. 크기가 큰 만큼 배치 공간을 먼저 확인하면 좋습니다.',
    price: 18000,
    stock: 18,
    category: '화분',
    image: productImage('Slit-pot.jpg'),
    createdAt: '2026-03-17T09:00:00Z',
  },
]

export const categories = ['전체', '대형식물', '중형식물', '공기정화식물', '다육식물', '화분']
