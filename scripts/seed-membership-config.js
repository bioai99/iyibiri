const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const configs = [
  {
    id: 'haytap',
    membership_description: 'Haytap gonullusu olarak sokak hayvanlarina yardim edebilirsin.',
    membership_form_fields: [
      { key: 'phone', label: 'Telefon', type: 'tel', required: true },
      { key: 'motivation', label: 'Neden gonullu olmak istiyorsun?', type: 'textarea', required: false },
    ],
  },
  {
    id: 'ibb',
    membership_description: 'IBB Gonulluleri programina katil, Istanbul icin fark yarat.',
    membership_form_fields: [
      { key: 'phone', label: 'Telefon', type: 'tel', required: true },
      { key: 'experience', label: 'Daha once gonulluluk yaptin mi?', type: 'select', options: ['Evet', 'Hayir', 'Kismen'], required: false },
    ],
  },
  {
    id: 'tema',
    membership_description: 'TEMA gonullusu ol, dogayi koru.',
  },
  {
    id: 'kizilay',
    membership_description: 'Kizilay gonullusu olarak insani yardima katkida bulun.',
  },
  {
    id: 'cydd',
    membership_description: 'CYDD gonullusu olarak egitimde firsat esitligine destek ver.',
  },
  {
    id: 'kodluyoruz',
    membership_description: 'Kodluyoruz mentoru ol, gelecegi kodla.',
  },
]

async function seed() {
  for (const cfg of configs) {
    const update = {
      membership_enabled: true,
      membership_description: cfg.membership_description,
    }
    if (cfg.membership_form_fields) {
      update.membership_form_fields = cfg.membership_form_fields
    }
    const { error } = await supabase
      .from('ngos')
      .update(update)
      .eq('id', cfg.id)
    if (error) {
      console.error(`Error updating ${cfg.id}:`, error.message)
    } else {
      console.log(`Updated ${cfg.id}`)
    }
  }
  console.log('Done!')
}

seed()
