import { Product } from '../types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '몬스테라 델리시오사',
    description: '인테리어에 완벽한 열대 식물',
    detailedDescription:
      '몬스테라는 열대 우림 지역이 원산지인 아름다운 관엽식물입니다. 큰 잎과 독특한 잎 모양으로 인테리어 효과가 뛰어납니다.',
    careInstructions: '밝은 간접광을 선호하며, 토양이 마르면 충분히 물을 주세요. 습도가 높은 환경을 좋아합니다.',
    price: 35000,
    stock: 15,
    category: '대형식물',
    image:
      'https://images.unsplash.com/photo-1653404809389-f370ea4310dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25zdGVyYSUyMGRlbGljaW9zYSUyMHBsYW50fGVufDF8fHx8MTc3MzU3OTU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: '다육이 모음',
    description: '관리하기 쉬운 귀여운 다육식물',
    detailedDescription:
      '다양한 종류의 다육식물을 모아놓은 세트입니다. 작은 공간에도 잘 어울리며 관리가 매우 쉽습니다.',
    careInstructions: '밝은 빛을 좋아하며, 물은 2주에 한 번 정도 주시면 됩니다. 과습에 주의하세요.',
    price: 12000,
    stock: 30,
    category: '다육식물',
    image:
      'https://images.unsplash.com/photo-1643717094992-5ab09ef07263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjdWxlbnQlMjBjYWN0dXMlMjBwbGFudHxlbnwxfHx8fDE3NzM2NTYyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-14T10:00:00Z',
  },
  {
    id: '3',
    name: '스투키',
    description: '공기정화 능력이 뛰어난 식물',
    detailedDescription: '스투키는 산소를 많이 배출하며 공기정화 능력이 뛰어난 식물입니다. 초보자도 기르기 쉽습니다.',
    careInstructions: '밝은 빛에서 그늘까지 다양한 환경에 적응합니다. 물은 한 달에 1-2회면 충분합니다.',
    price: 18000,
    stock: 20,
    category: '공기정화식물',
    image:
      'https://images.unsplash.com/photo-1613498630970-f2a333cb4974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHBsYW50JTIwc2Fuc2V2aWVyaWF8ZW58MXx8fHwxNzczNjUyODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-13T10:00:00Z',
  },
  {
    id: '4',
    name: '떡갈고무나무',
    description: '넓은 잎이 매력적인 고무나무',
    detailedDescription: '떡갈고무나무는 넓고 두꺼운 잎이 특징인 인기 있는 관엽식물입니다. 공간을 풍성하게 채워줍니다.',
    careInstructions: '밝은 간접광에서 잘 자라며, 주 1회 정도 물을 주세요. 잎에 먼지가 쌓이면 닦아주세요.',
    price: 28000,
    stock: 12,
    category: '대형식물',
    image:
      'https://images.unsplash.com/photo-1673297352939-e308a901b5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWRkbGUlMjBsZWFmJTIwZmlnJTIwdHJlZXxlbnwxfHx8fDE3NzM1NjY1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-12T10:00:00Z',
  },
  {
    id: '5',
    name: '고무나무',
    description: '세련된 분위기의 고무나무',
    detailedDescription: '고무나무는 광택이 나는 잎이 세련된 분위기를 연출합니다. 실내 공기정화에도 좋습니다.',
    careInstructions: '밝은 곳을 선호하지만 반그늘에서도 잘 자랍니다. 겉흙이 마르면 물을 주세요.',
    price: 25000,
    stock: 18,
    category: '대형식물',
    image:
      'https://images.unsplash.com/photo-1623032693199-e9abd35e0a98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJiZXIlMjBwbGFudCUyMGZpY3VzfGVufDF8fHx8MTc3MzY1Mjg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-11T10:00:00Z',
  },
  {
    id: '6',
    name: '스킨답서스',
    description: '공중 정원에 완벽한 덩굴 식물',
    detailedDescription: '스킨답서스는 덩굴 식물로 매달아 기르기 좋으며, 공기정화 능력도 뛰어납니다.',
    careInstructions: '밝은 간접광에서 잘 자라며, 토양이 마르면 물을 주세요. 과습에 주의하세요.',
    price: 15000,
    stock: 25,
    category: '공기정화식물',
    image:
      'https://images.unsplash.com/photo-1595524147656-eb5d0a63e9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob3MlMjBwbGFudCUyMGhhbmdpbmd8ZW58MXx8fHwxNzczNTgwMjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: '7',
    name: '스파티필름',
    description: '하얀 꽃이 아름다운 식물',
    detailedDescription: '스파티필름은 하얀 꽃이 피는 아름다운 식물로, NASA가 선정한 공기정화 식물입니다.',
    careInstructions: '반그늘에서 잘 자라며, 토양을 촉촉하게 유지해주세요. 물을 좋아하는 식물입니다.',
    price: 20000,
    stock: 22,
    category: '공기정화식물',
    image:
      'https://images.unsplash.com/photo-1707264689599-f4ab29ccbb1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZSUyMGxpbHklMjBzcGF0aGlwaHlsbHVtfGVufDF8fHx8MTc3MzU4Nzc5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '8',
    name: '알로에 베라',
    description: '약용으로도 사용 가능한 다육식물',
    detailedDescription: '알로에 베라는 피부 진정 효과가 있어 약용으로도 사용되는 다육식물입니다.',
    careInstructions: '햇빛을 좋아하며, 물은 2주에 한 번 정도 주세요. 배수가 잘 되는 토양이 좋습니다.',
    price: 14000,
    stock: 28,
    category: '다육식물',
    image:
      'https://images.unsplash.com/photo-1684913127590-54e08d09a34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9lJTIwdmVyYSUyMHBsYW50fGVufDF8fHx8MTc3MzYwNzY5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-08T10:00:00Z',
  },
  {
    id: '9',
    name: '보스턴 고사리',
    description: '섬세한 잎이 아름다운 고사리',
    detailedDescription: '보스턴 고사리는 섬세하고 풍성한 잎이 매력적인 식물로, 습한 환경을 좋아합니다.',
    careInstructions: '밝은 간접광과 높은 습도를 선호합니다. 토양을 항상 촉촉하게 유지하세요.',
    price: 16000,
    stock: 0,
    category: '중형식물',
    image:
      'https://images.unsplash.com/photo-1497877164981-9c2afdf31e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3N0b24lMjBmZXJuJTIwcGxhbnR8ZW58MXx8fHwxNzczNjU2MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-07T10:00:00Z',
  },
  {
    id: '10',
    name: 'ZZ 플랜트',
    description: '거의 죽지 않는 초보자용 식물',
    detailedDescription: 'ZZ 플랜트는 매우 관리하기 쉬운 식물로, 낮은 광량과 드물게 주는 물에도 잘 견딥니다.',
    careInstructions: '낮은 빛에서도 잘 자라며, 물은 한 달에 1-2회면 충분합니다. 과습을 피하세요.',
    price: 22000,
    stock: 16,
    category: '중형식물',
    image:
      'https://images.unsplash.com/photo-1547414924-b71ebb598495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6YW1pb2N1bGNhcyUyMHBsYW50JTIwenp8ZW58MXx8fHwxNzczNjU2MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-06T10:00:00Z',
  },
  {
    id: '11',
    name: '칼라데아',
    description: '무늬가 아름다운 열대 식물',
    detailedDescription: '칼라데아는 독특한 무늬의 잎이 매력적인 식물로, 다양한 품종이 있습니다.',
    careInstructions: '밝은 간접광과 높은 습도를 좋아합니다. 토양을 촉촉하게 유지하되 과습은 피하세요.',
    price: 24000,
    stock: 14,
    category: '중형식물',
    image:
      'https://images.unsplash.com/photo-1658524136379-6b697258b58d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxhdGhlYSUyMHBsYW50JTIwbGVhdmVzfGVufDF8fHx8MTc3MzY1NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '12',
    name: '화분 세트',
    description: '다양한 식물을 담을 수 있는 화분',
    detailedDescription: '심플하고 세련된 디자인의 화분 세트입니다. 다양한 크기로 구성되어 있습니다.',
    careInstructions: '배수 구멍이 있어 물 빠짐이 좋습니다.',
    price: 8000,
    stock: 50,
    category: '화분',
    image:
      'https://images.unsplash.com/photo-1563419837758-e48ef1b731dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3R0ZWQlMjBwbGFudCUyMGluZG9vcnxlbnwxfHx8fDE3NzM1NDE4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: '2026-03-04T10:00:00Z',
  },
]

export const categories = ['전체', '대형식물', '중형식물', '공기정화식물', '다육식물', '화분']
