Hooks:PostHook(ChallengeCardsTweakData, "init", "dump_cards", function(self, tweak_data)
	log(json.encode(self.cards))
end)
